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
    hash: string,
    user: User,
    store: Store,
  ) {
    const orders = await this.ordersService.findAllOrderByUser(user.id, true);
   
    if (orders) {
      const products: Product[] = [];

      orders.forEach((order) => {
        products.push(...order.orderHistorics.map((oh) => oh.product));
      });

      const feedbacks = createFeedbackDto.feedbacks;
      const feedbacksToSave = [];
      const productsToSave = [];

      feedbacks.forEach((feedback) => {
        const resultSearch = products.find((p) => p.id === feedback.productId);

        if (resultSearch) {
          const feedbackToCreate = this.feedbackRepository.create({
            comment: feedback.comment,
            star: feedback.star,
          });

          resultSearch.sumStars += feedback.star;
          resultSearch.sumFeedbacks += 1;
          resultSearch.avgStars =
            resultSearch.sumStars / resultSearch.sumFeedbacks;

          productsToSave.push(resultSearch);

          store.sumStars += feedback.star;
          store.sumFeedbacks += 1;
          store.avgStars = store.sumStars / store.sumFeedbacks;

          feedbackToCreate.user = user;
          feedbackToCreate.product = resultSearch;

          feedbacksToSave.push(feedbackToCreate);
        }
      });
      await this.productService.saveAll(productsToSave);
      await this.storesService.save(store);

      return this.feedbackRepository.save(feedbacksToSave);
    } else {
      throw new Error('Product not found in shopping');
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
    return this.productService.findOne(product_id, {
      files: false,
      store: false,
      feedbacks: true,
      feedbacksUser: true,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackRepository.update(id, updateFeedbackDto);
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
