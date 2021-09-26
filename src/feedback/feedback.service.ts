import { Feedback } from './entities/feedback.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto, user: User) {
    try {
      const feedback = this.feedbackRepository.create(createFeedbackDto);
      feedback.user = user;
      feedback.product.sumStars += createFeedbackDto.start;
      feedback.product.sumFeedbacks += 1;
      feedback.product.avgStars =
        feedback.product.sumStars / feedback.product.sumFeedbacks;

      feedback.product.store.sumStars += createFeedbackDto.start;
      feedback.product.store.sumFeedbacks += 1;
      feedback.product.store.avgStars =
        feedback.product.store.sumStars / feedback.product.store.sumFeedbacks;

      return await feedback.save();
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
      .select(['feedback', 'user.firstName', 'user.lastName'])
      .orderBy('createdAt', 'DESC')
      .execute();

    if (allFeedbacks.length == 0) {
      throw new NotFoundException("The Store doesn't have any feedbacks yet.");
    }

    return allFeedbacks;
  }

  async fromProduct(product_id: string) {
    const allFeedbacksFromProduct = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.product', 'product')
      .where('product.id = :id', { id: product_id })
      .select(['feedback', 'user.firstName', 'user.lastName'])
      .execute();

    if (allFeedbacksFromProduct.length == 0) {
      throw new NotFoundException("The Store doesn't have any feedbacks yet.");
    }

    return allFeedbacksFromProduct;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, _updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
