import { FeedbackService } from './../feedback/feedback.service';
import { OrdersService } from './../orders/orders.service';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';
import { FindMostSolds } from './dto/find-most-solds.dto';

@Injectable()
export class DashboardService {
  constructor(
    private ordersService: OrdersService,
    private feedbackService: FeedbackService,
  ) {}

  async mostSolds(store_id: string, findMostSolds: FindMostSolds) {
    return await this.ordersService.findMostSolds(
      store_id,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }
  async lastSolds(
    store_id: string,
    limit?: number,
    offset?: number,
  ): Promise<Order[]> {
    return await this.ordersService.findLastSold(store_id, limit, offset);
  }

  async lastFeedbacks(store_id: string) {
    return this.feedbackService.findAllFeedbacksFromStore(store_id);
  }

  async amountSoldProducts(store_id: string, findMostSolds: FindMostSolds) {
    return await this.ordersService.amountSolds(
      store_id,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }
  async income(store_id: string, findMostSolds: FindMostSolds) {
    return await this.ordersService.income(
      store_id,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }
}
