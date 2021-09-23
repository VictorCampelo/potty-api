import { Feedback } from './entities/feedback.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      let feedback = this.feedbackRepository.create(createFeedbackDto);
      feedback.user = user;
      return await feedback.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllFeedbacksFromStore(store_id: string) {
    const allFeedbacks = await this.feedbackRepository.find({
      where: {
        product: { store: store_id },
      },
      relations: ['product', 'product.store'],
    });

    if (allFeedbacks.length == 0) {
      throw new NotFoundException("The Store doesn't have any feedbacks yet.");
    }

    return allFeedbacks;
  }

  async fromProduct(product_id: string) {
    const allFeedbacksFromProduct = await this.feedbackRepository.find({
      where: {
        product: product_id,
      },
      relations: ['product'],
    });

    if (allFeedbacksFromProduct.length == 0) {
      throw new NotFoundException("The Store doesn't have any feedbacks yet.");
    }

    return allFeedbacksFromProduct;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
