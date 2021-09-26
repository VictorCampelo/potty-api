import { FeedbackService } from './../feedback/feedback.service';
import { OrdersService } from './../orders/orders.service';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';

@Injectable()
export class DashboardService {
  constructor(
    private ordersService: OrdersService,
    private feedbackService: FeedbackService,
  ) {}

  mostSolds() {
    return `This action returns all dashboard`;
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

  amountSoldProducts() {
    return `This action returns all dashboard`;
  }
  income() {
    return `This action returns all dashboard`;
  }
}
