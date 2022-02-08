import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { StoresService } from 'src/stores/stores.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { getConnection, getManager, Repository } from 'typeorm';
import { CreateOrderDto, IProductsToListMsg } from './dto/create-order.dto';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { Store } from 'src/stores/store.entity';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { CouponsService } from 'src/coupons/coupons.service';
import { UsersService } from 'src/users/users.service';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductsService,
    private readonly storesService: StoresService,
    private readonly couponsService: CouponsService,
    private readonly historicsService: OrderHistoricsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<{ orders: Order[]; messages: string[] }> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const messages: string[] = [];
      const historics: OrderHistoric[] = [];
      const orders: Order[] = [];
      const productsToSave = [];

      const userInfo = await this.usersService.findUserById(user.id);
      const stores = await this.storesService.findAllByIds(
        createOrderDto.products.map((prod) => prod.storeId),
      );

      let coupon: Coupon;
      let couponWasUsed: boolean;

      if (createOrderDto?.couponCode) {
        coupon = await this.couponsService.findOne(createOrderDto?.couponCode);

        if (!coupon) {
          throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
        }

        if (
          !(await this.couponsService.checkCoupom(coupon.code, coupon.storeId))
        ) {
          throw new HttpException('Invalid Coupon', HttpStatus.BAD_REQUEST);
        }

        if (coupon.maxUsage <= 0) {
          throw new HttpException(
            'Coupon exceeded maximum usage',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (
          (coupon.validate && new Date() > coupon.validate) ||
          coupon.isExpired
        ) {
          throw new HttpException(`Coupon expired`, HttpStatus.BAD_REQUEST);
        }
      }

      for (const storeOrder of createOrderDto.products) {
        if (
          storeOrder.delivery &&
          (!userInfo.zipcode ||
            !userInfo.city ||
            !userInfo.street ||
            !userInfo.neighborhood ||
            !userInfo.addressNumber)
        ) {
          throw new HttpException(
            'Missing some address information from Customer: zipcode, city, neighborhood, street or addressNumber',
            HttpStatus.BAD_REQUEST,
          );
        }

        const store: Store = stores.find(
          (obj) => obj.id === storeOrder.storeId,
        );

        const order = this.orderRepository.create({
          id: uuidv4(),
          store,
          user,
          status: false,
          couponId: coupon && coupon.id,
          requiresDelivery: storeOrder.delivery,
          customerAddress: `${userInfo.street}, ${userInfo.addressNumber} - ${
            userInfo.neighborhood
          }, ${userInfo.city} - ${userInfo.uf}, ${userInfo.zipcode}. ${
            userInfo.complement ? `Complemento: ${userInfo.complement}.` : ''
          } ${userInfo.logradouro ? `Logradouro: ${userInfo.logradouro}` : ''}`,
          situation: 'Recebido',
        });

        let sumAmount = 0;
        const productsListToMsg: IProductsToListMsg[] = [];

        const products = await this.productService.findProductstByIdsAndStoreId(
          storeOrder.orderProducts.map((prod) => prod.productId),
          store.id,
        );

        for (const prod of storeOrder.orderProducts) {
          const product = products.find((obj) => obj.id === prod.productId);

          if (!product) {
            throw new HttpException(`Product not found`, HttpStatus.NOT_FOUND);
          }

          if (prod.amount > product.inventory) {
            throw new HttpException(
              `There aren't enough '${product.title}'.`,
              HttpStatus.FORBIDDEN,
            );
          }

          if (prod.parcels > product.parcelAmount) {
            throw new HttpException(
              `Maximum parcels allowed on product '${product.title}' is ${product.parcelAmount}. You're trying ${prod.parcels}.`,
              HttpStatus.FORBIDDEN,
            );
          }

          product.sumOrders += prod.amount;
          product.lastSold = new Date();
          productsToSave.push(product);

          store.sumOrders += prod.amount;

          const history = this.historicsService.create({
            storeId: storeOrder.storeId,
            productId: product.id,
            orderId: order.id,
            productQtd: prod.amount,
            productPrice: product.price,
            productParcels: prod.parcels,
            customerId: user.id,
          });

          sumAmount +=
            prod.amount *
            (product.discount
              ? product.price - product.price * (product.discount / 100)
              : product.price);

          /* CUPONS */
          if (coupon && coupon.storeId === storeOrder.storeId) {
            if (coupon.range === 'category') {
              // verifica categoria
              if (
                product.categories &&
                product.categories.some(
                  (category) =>
                    coupon.categories.filter((c) => c.id === category.id)
                      .length,
                )
              ) {
                sumAmount = this.applyCouponDiscountBasedOnType(
                  coupon.type,
                  sumAmount,
                  coupon.discountValue,
                  coupon.discountPorcent,
                  prod.amount *
                    (product.discount
                      ? product.price * (product.discount / 100)
                      : product.price),
                );

                couponWasUsed = true;
              } else {
                throw new HttpException(
                  `Product '${product.title}' doesn't belong to any category allowed by coupon '${coupon.code}'`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            } else if (coupon.range === 'store') {
              // ja verificado se é dessa loja
              sumAmount = this.applyCouponDiscountBasedOnType(
                coupon.type,
                sumAmount,
                coupon.discountValue,
                coupon.discountPorcent,
                prod.amount *
                  (product.discount
                    ? product.price * (product.discount / 100)
                    : product.price),
              );

              couponWasUsed = true;
            } else if (coupon.range === 'first-buy') {
              // verifica se é primeira compra
              const userHistory =
                await this.historicsService.findCustomerHistory(
                  user.id,
                  storeOrder.storeId,
                );

              if (!userHistory.length) {
                sumAmount = this.applyCouponDiscountBasedOnType(
                  coupon.type,
                  sumAmount,
                  coupon.discountValue,
                  coupon.discountPorcent,
                  prod.amount *
                    (product.discount
                      ? product.price * (product.discount / 100)
                      : product.price),
                );

                couponWasUsed = true;
              } else {
                throw new HttpException(
                  `The Coupon '${coupon.code}' cannot be applied on Product '${product.title}' because it's not your first buy`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }
          /* CUPONS */

          productsListToMsg.push({
            amount: prod.amount,
            title: product.title,
            parcels: prod.parcels,
          });

          // order.amount =
          //   couponDiscount > 0
          //     ? sumAmount + sumAmount * (1 - couponDiscount / 100)
          //     : sumAmount;
          order.amount = sumAmount;

          historics.push(history);
        }

        messages.push(
          this.createWhatsappMessage(
            userInfo,
            productsListToMsg,
            sumAmount,
            store,
            storeOrder.delivery,
          ),
        );

        orders.push(order);
      }

      if (couponWasUsed) {
        await this.couponsService.decreaseUsedCoupon(coupon);
      }

      await this.productService.saveProducts(productsToSave);
      await this.orderRepository.save(orders);
      await this.historicsService.saveAll(historics);
      await this.storesService.saveAll(stores);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { orders, messages };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  private applyCouponDiscountBasedOnType(
    discountType: string,
    currentSumAmount: number,
    discountValue?: number,
    discountPorcent?: number,
    productPrice?: number,
  ) {
    if (discountType !== 'money' && discountType !== 'percentage') {
      throw new HttpException(
        'Invalid discount type (must be money or percentage).',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (discountType === 'money') {
      return (currentSumAmount -= discountValue);
    }

    return (currentSumAmount -= productPrice * discountPorcent);
  }

  private createWhatsappMessage(
    user: User,
    productsListToMsg: IProductsToListMsg[],
    sumAmount: number,
    store: Store,
    delivery?: boolean,
  ) {
    const paymentMethod = `${productsListToMsg.map((p) => {
      if (p.parcels > 1) {
        return " '" + p.title + "' parcelado em " + p.parcels + ' vezes';
      } else {
        return " À vista: '" + p.title + "'";
      }
    })}`;

    const text = `🛍️ *Novo pedido!* 🛍️%0a%0a*Nome do Cliente:* ${
      user.firstName
    } ${user.lastName}%0a%0a*Itens do Pedido:*%0a${productsListToMsg
      .map((p) => {
        return '  🏷️ ' + p.amount + 'x ' + p.title + '%0a';
      })
      .join('')}%0a*Total do Pedido:* R$ ${sumAmount}%0a*Forma de Envio:* ${
      delivery ? 'Entrega' : 'Retirada em loja'
    }%0a${
      delivery
        ? `*Custo do Envio:* ${
            store.deliveryFee
              ? `${'R$ ' + store.deliveryFee} `
              : 'Taxa de envio não cadastrada'
          }%0a`
        : '%0a'
    }*Forma de pagamento:*${paymentMethod}%0a%0a*Endereço do Cliente:*%0a*Rua*: ${
      user.street
    }%0a*Número:* ${user.addressNumber}%0a*Bairro:* ${
      user.neighborhood
    }%0a*Cidade:* ${user.city} - ${user.uf}${
      user.logradouro ? `%0a*Logradouro:*  ${user.logradouro}` : ''
    }${user.complement ? `%0a*Complemento:* ${user.complement}%0a` : ''}`;
    return `https://api.whatsapp.com/send?phone=55${store.phone}&text=${text}`;
  }

  async fillAllOrderByStatus(
    storeId: string,
    confirmed: boolean,
    limit?: number,
    offset?: number,
  ) {
    if (!limit) {
      limit = 10;
    }
    if (!offset) {
      offset = 0;
    }

    return getManager().query(
      `
      select
	      o.*,
	      oh.product_qtd::integer
      from
	      "order" o
      left join 
        (select
		        sum(oh2."productQtd") as product_qtd,
		        oh2."orderId"
	        from
		        order_historic oh2
	        group by
		        oh2."orderId") as oh
      on 
	      oh."orderId" = o.id
      where
	      o.store_id = $1
      and
        o.status = $2
      order by
          "createdAt" DESC
      limit $3
      offset $4

    `,
      [storeId, confirmed, limit, offset],
    );
  }

  async confirmOrder(orderId: string, storeId: string) {
    const order = await this.orderRepository.findOne(orderId, {
      where: {
        storeId,
        status: false,
      },
      relations: ['orderHistorics', 'orderHistorics.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order not found`);
    }
    const products = [];
    order.orderHistorics.forEach((history) => {
      history.product.inventory -= history.productQtd;
      products.push(history.product);
    });
    order.status = true;
    await this.productService.saveAll(products);
    return this.orderRepository.save(order);
  }
  /*
income(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        (qb) =>
          qb
            .addSelect('*')
            .addSelect((subQuery) => {
              return subQuery
                .select('SUM(order.amount)')
                .from(Order, 'order')
                .where('order.productId = product.id')
                .groupBy('order.productId');
            }, 'qtd')
            .from(Product, 'product'),
        'product',
        'product.id = order.productId',
      )
      .select(`date_trunc('week', "order"."createdAt"::date) as weekly`)
      .addSelect('product.price * product.qtd', 'income')
      .groupBy('weekly')
      .addGroupBy('product.id')
      .addGroupBy('product.price')
      .addGroupBy('product.qtd')
      .orderBy('weekly')
      .where('product.store_id = :id', { id: storeId })
      .andWhere('order.createdAt between :start and :end', {
        start: startDate,
        end: endDate,
      })
      .offset(offset)
      .limit(limit)
      .getRawMany();
  }

*/

  findOneToUser(id: string, userId: string) {
    return this.orderRepository.findOne(id, {
      where: {
        userId,
      },
      relations: ['orderHistorics', 'orderHistorics.product'],
    });
  }

  async findOneToStore(id: string, storeId: string) {
    return this.orderRepository.findOne(id, {
      where: {
        storeId,
      },
      relations: ['orderHistorics', 'orderHistorics.product'],
    });
  }

  async findAllOrderByUser(
    userId: string,
    confirmed: boolean,
    limit?: number,
    offset?: number,
  ) {
    return this.orderRepository.find({
      where: {
        userId,
        status: confirmed,
      },
      relations: ['orderHistorics', 'orderHistorics.product'],
      take: limit ? limit : 10,
      skip: offset ? offset : 0,
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderSituation(updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(
      {
        id: updateOrderDto.orderId,
      },
      {
        situation: updateOrderDto.situation,
      },
    );
  }
}
