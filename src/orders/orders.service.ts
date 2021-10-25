import { StoresService } from 'src/stores/stores.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { Store } from 'src/stores/store.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductsService,
    private storesService: StoresService,
  ) {}

  async findAllPending(
    storeId: string,
    confirmed: boolean,
    limit?: number,
    offset?: number,
  ) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        (qb) => qb.select().from(Product, 'product'),
        'product',
        'product.id = order.productId',
      )
      .select(['order', 'product'])
      .where('product.store_id = :id', { id: storeId })
      .andWhere('order.status = :status', { status: confirmed })
      .limit(limit)
      .offset(offset)
      .orderBy('order.createdAt', 'DESC')
      .getRawMany();

    return orders;
  }

  async confirmOrder(id: string) {
    const order = await this.orderRepository.findOne(id);
    order.status = true;
    return await order.save();
  }

  async create(
    createOrderDto: CreateOrderDto,
    user: User,
    store: Store,
  ): Promise<{ orders2: Order[]; msg: string }> {
    let values = 0;
    const orders = [];
    const productsToSave = [];
    const productIds = createOrderDto.products.map((prod) => prod.productId);
    const products = await this.productService.findProductstByIds(productIds);

    createOrderDto.products.forEach((order) => {
      const product = products.find((obj) => obj.id === order.productId);

      if (order.amount > product.inventory) {
        throw new UnauthorizedException(`There aren't enough ${product.title}`);
      }

      product.sumOrders += order.amount;
      //TODO: ACHO MELHOR DIMINUIR O INVENTORY SOMENTE APÓS A CONFIRMAÇÃO DO PEDIDO
      product.inventory -= order.amount;
      product.lastSold = new Date();
      productsToSave.push(product);

      store.sumOrders += order.amount;

      const orderToCreate = this.orderRepository.create({
        amount: order.amount,
        product: product,
      });
      orderToCreate.user = user;
      orders.push(orderToCreate);
      values += order.amount * product.price;
    });

    const text = `Novo pedido! Nome do Cliente: ${
      user.firstName + ' ' + user.lastName
    } Itens do Pedido: ${createOrderDto.products.map((order) => {
      return `${
        order.amount +
        ' ' +
        products.find((obj) => obj.id === order.productId).title
      }`;
    })} Total do Pedido: R$ ${values} Forma de Envio: Entrega Custo do Envio: 5,00 Endereço do Cliente Rua Isaac Irineu - 5415 - Universidade Federal do Piauí Teresina - PI Referência: fffd Meio de Pagamento: À vista Precisa de troco para R$ 100,00`;
    const msg = `https://api.whatsapp.com/send?phone=55${store.phone}1&text=${text}`;

    await this.storesService.save(store);
    await this.productService.saveAll(productsToSave);
    const orders2 = await this.orderRepository.save(orders);
    return { orders2, msg };
  }

  async findLastSold(
    storeId: string,
    limit?: number,
    offset?: number,
  ): Promise<Order[]> {
    console.log(limit);
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        (qb) => qb.select().from(Product, 'product'),
        'product',
        'product.id = order.productId',
      )
      .select(['order', 'product'])
      .where('product.store_id = :id', { id: storeId })
      .limit(limit)
      .offset(offset)
      .orderBy('order.createdAt', 'DESC')
      .getRawMany();

    return orders;
  }

  async income(
    store_id: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<Order[]> {
    try {
      const orders = await this.orderRepository
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
        .where('product.store_id = :id', { id: store_id })
        .andWhere('order.createdAt between :start and :end', {
          start: startDate,
          end: endDate,
        })
        .offset(offset)
        .limit(limit)
        .getRawMany();

      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderRepository.findOne(id, {
      relations: ['product', 'product.store'],
    });
  }

  async findAllFinishedOrderByUser(
    userId: string,
    limit?: number,
    offset?: number,
  ) {
    console.log('aqui');
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .select(['order', 'product'])
      .where('order.userId = :id', { id: userId })
      .andWhere('order.status = :status', { status: true })
      .limit(limit)
      .offset(offset)
      .orderBy('order.createdAt', 'DESC')
      .getRawMany();
  }

  async findAllOrderByUser(userId: string, limit?: number, offset?: number) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .select(['order', 'product'])
      .where('order.userId = :id', { id: userId })
      .limit(limit)
      .offset(offset)
      .orderBy('order.createdAt', 'DESC')
      .getRawMany();
  }
}
