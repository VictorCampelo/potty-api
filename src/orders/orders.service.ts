import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductSoldDto } from './dto/product-sold.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const products = [];
    createOrderDto.products.map((order) => {
      const MappedProducts = [];
      order.product.sumOrders += order.amount;
      order.product.lastSold = new Date();
      Array(order.amount).forEach(() => {
        MappedProducts.push(order.product);
      });
      products.push(MappedProducts);
    });

    const order = this.orderRepository.create({ products: products });
    order.user = createOrderDto.user;

    return await order.save();
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findMostSolds(
    store_id: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<Order[]> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.product', 'product')
      .leftJoin('product.store', 'store')
      .select(['product'])
      .addSelect('COUNT(product.id)', 'qtd')
      .groupBy('product.id')
      .where('store.id = :id', { id: store_id })
      .andWhere('createdAt is between(:start, :end)', {
        start: startDate,
        end: endDate,
      })
      .offset(offset)
      .limit(limit)
      .getRawMany();

    return orders;
  }

  async findLastSold(
    store_id: string,
    limit?: number,
    offset?: number,
  ): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: {
        product: { store: store_id },
      },
      relations: ['product', 'product.store'],
      order: {
        createdAt: 'ASC',
      },
      skip: offset ? offset : 0,
      take: limit ? limit : 10,
    });

    return orders;
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne(id, {
      relations: ['product', 'product.store'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
