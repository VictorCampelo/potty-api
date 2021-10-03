import { StoresService } from 'src/stores/stores.service';
import { Injectable } from '@nestjs/common';
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

  async create(
    createOrderDto: CreateOrderDto,
    user: User,
    store: Store,
  ): Promise<Order[]> {
    const orders = [];
    const products = [];
    createOrderDto.products.map((order) => {
      order.product.sumOrders += order.amount;
      order.product.lastSold = new Date();
      products.push(order.product);

      store.sumOrders += order.amount;

      const orderToCreate = this.orderRepository.create(order);
      orderToCreate.user = user;
      orders.push(orderToCreate);
    });

    await this.storesService.save(store);
    await this.productService.saveAll(products);
    return await this.orderRepository.save(orders);
  }

  async findLastSold(
    store_id: string,
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
      .where('product.store_id = :id', { id: store_id })
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

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne(id, {
      relations: ['product', 'product.store'],
    });
  }
}
