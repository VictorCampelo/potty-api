import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order[]> {
    const allProducts = await this.productService.findAll();

    const orders: Order[] = [];

    createOrderDto.orders.forEach((order) => {
      let filteredProduct = allProducts.filter(
        (product) => product.id === order.product_id,
      );

      if (filteredProduct.length == 0) {
        throw new NotFoundException(
          `Product ${order.product_id} not found while trying to create a Order`,
        );
      }

      const currentOrder = this.orderRepository.create();
      currentOrder.user = createOrderDto.user;
      currentOrder.product = filteredProduct[0];
      filteredProduct = null;
      currentOrder.amount = order.amount;
      orders.push(currentOrder);
    });

    return orders;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
