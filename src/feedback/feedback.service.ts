import { OrdersService } from './../orders/orders.service';
import { Store } from 'src/stores/store.entity';
import { Feedback } from './feedback.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { Product } from 'src/products/product.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private productService: ProductsService,
    private storesService: StoresService,
    private ordersService: OrdersService,
  ) {}
  async create(
    createFeedbackDto: CreateFeedbackDto,
    product: Product,
    user: User,
    store: Store,
  ) {
    try {
      // se product tem uma order feita pelo usuário e essa ordem esta com status finalizado

      const userOrders = await this.ordersService.findAllFinishedOrderByUser(
        user.id,
      );

      const hit = userOrders.find((order) => order.product.id === product.id);

      if (hit) {
        const feedback = this.feedbackRepository.create();

        feedback.comment = createFeedbackDto.comment;
        feedback.star = createFeedbackDto.star;

        product.sumStars += createFeedbackDto.star;
        product.sumFeedbacks += 1;
        product.avgStars = product.sumStars / product.sumFeedbacks;

        store.sumStars += createFeedbackDto.star;
        store.sumFeedbacks += 1;
        store.avgStars = store.sumStars / store.sumFeedbacks;

        feedback.user = user;
        feedback.product = product;

        await this.storesService.save(store);
        await this.productService.saveAll([product]);

        return await feedback.save();
      } else {
        throw new Error('Product not found in shopping');
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllFeedbacksFromStore(store_id: string) {
    const allFeedbacks = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.product', 'product')
      .leftJoinAndSelect('product.store', 'store')
      .where('store.id = :id', { id: store_id })
      .select(['feedback', 'user', 'product'])
      .orderBy('feedback.createdAt', 'DESC')
      .execute();

    if (allFeedbacks.length == 0) {
      throw new NotFoundException("The Store doesn't have any feedbacks yet.");
    }

    return allFeedbacks;
  }

  async fromProduct(product_id: string) {
    return await this.productService.findOne(product_id, {
      relations: {
        files: false,
        store: false,
        feedbacks: true,
        feedbacksUser: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return await this.feedbackRepository.update(id, updateFeedbackDto);
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
