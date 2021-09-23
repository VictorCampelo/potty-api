import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
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

  async getMostSoldProducts(store_id: string): Promise<ProductSoldDto[]> {
    // * Pega todos os pedidos cuja Loja corresponde a Loja passada por param
    const allOrders = await this.orderRepository.find({
      where: {
        product: { store: store_id },
      },
      relations: ['product', 'product.store'],
    });

    if (allOrders.length == 0) {
      throw new NotFoundException("This Store didn't sell any product yet.");
    }

    const filteredProducts: ProductSoldDto[] = [];

    allOrders.forEach((order) => {
      const productIndex = filteredProducts.findIndex(
        (product) => product.id == order.product.id,
      );

      if (productIndex == -1) {
        filteredProducts.push({
          id: order.product.id,
          order_id: order.orderid,
          name: order.product.title,
          amount: order.amount,
        });
      } else {
        filteredProducts[productIndex].amount += order.amount;
      }
    });

    const sorted = filteredProducts.sort((a, b) => {
      return b.amount - a.amount;
    });

    return sorted;
  }

  async findLastSold(store_id: string): Promise<Order[]> {
    const allOrders = await this.orderRepository.find({
      where: {
        product: { store: store_id },
      },
      relations: ['product', 'product.store'],
    });

    const sorted = allOrders.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return sorted;
  }

  findAll() {
    return `This action returns all orders`;
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
