import { findOrdersDto } from './dto/find-order.dto';
import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { StoresService } from 'src/stores/stores.service';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { getConnection, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { Store } from 'src/stores/store.entity';
import { MD5 } from 'crypto-js';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { CouponsService } from 'src/coupons/coupons.service';
import { UsersService } from 'src/users/users.service';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';

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

      // for (const store of stores) {
      for (const storeOrder of createOrderDto.products) {
        const store: Store = stores.find(
          (obj) => obj.id === storeOrder.storeId,
        );

        console.log(store);

        let couponDiscount = 100;
        let coupon: any = {};

        if (createOrderDto?.couponCode) {
          coupon = await this.couponsService.checkCoupom(
            createOrderDto.couponCode,
            store.id,
          );
          if (coupon) {
            couponDiscount += coupon.discountPorcent;
          } else {
            throw new NotFoundException('Coupon Not Valid!');
          }
        }

        const order = this.orderRepository.create({
          id: uuidv4(),
          store,
          user,
          status: false,
          couponId: coupon?.id,
        });

        let sumAmount = 0;
        const productsListToMsg = [];
        // console.log(storeOrder.orderProducts);

        const products = await this.productService.findProductstByIdsAndStoreId(
          storeOrder.orderProducts.map((prod) => prod.productId),
          store.id,
        );

        storeOrder.orderProducts.forEach((prod) => {
          const product = products.find((obj) => obj.id === prod.productId);
          console.log(products);

          if (!product) {
            console.log(prod);
            console.log(store.id);

            throw new UnauthorizedException(`Product not found`);
          }

          if (prod.amount > product.inventory) {
            throw new UnauthorizedException(
              `There aren't enough ${product.title}`,
            );
          }

          product.sumOrders += prod.amount;
          product.lastSold = new Date();
          productsToSave.push(product);

          store.sumOrders += prod.amount;

          const history = this.historicsService.create({
            productId: product.id,
            orderId: order.id,
            productQtd: prod.amount,
            productPrice: product.price,
          });

          sumAmount += prod.amount * product.price;

          productsListToMsg.push(`${prod.amount} ${product.title} `);

          order.amount =
            couponDiscount > 0
              ? sumAmount + sumAmount * (1 - couponDiscount / 100)
              : sumAmount;

          historics.push(history);
        });

        messages.push(
          this.createWhatsappMessage(
            userInfo,
            productsListToMsg,
            sumAmount,
            store,
          ),
        );
        console.log(stores);

        orders.push(order);
      }
      // }

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

  private createWhatsappMessage(
    user: User,
    productsListToMsg: any[],
    sumAmount: number,
    store: Store,
  ) {
    const text = `Novo pedido! 
      Nome do Cliente: ${user.firstName} ${user.lastName}
      Itens do Pedido: ${productsListToMsg} Total do Pedido: R$ ${sumAmount} 
      Forma de Envio: Entrega Custo do Envio: 5,00 
      Endereço do Cliente: Rua Isaac Irineu - 5415 - Universidade Federal do Piauí Teresina - PI Referência: fffd 
      Meio de Pagamento: À vista Precisa de troco para R$ 100,00`;
    return `https://api.whatsapp.com/send?phone=55${store.phone}1&text=${text}`;
  }

  async fillAllOrderByStatus(
    storeId: string,
    confirmed: boolean,
    limit?: number,
    offset?: number,
  ) {
    return this.orderRepository.find({
      where: {
        storeId,
        status: confirmed,
      },
      relations: ['orderHistorics', 'orderHistorics.product'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
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
}
