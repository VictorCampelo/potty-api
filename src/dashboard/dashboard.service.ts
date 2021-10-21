import { ProductsService } from 'src/products/products.service';
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
    private productsService: ProductsService,
  ) {}

  async mostSolds(storeId: string, findMostSolds: FindMostSolds) {
    return await this.productsService.findMostSolds(
      storeId,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }

  async lastSolds(
    storeId: string,
    findMostSolds: FindMostSolds,
  ): Promise<Order[]> {
    return await this.ordersService.findLastSold(
      storeId,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }

  async lastFeedbacks(storeId: string) {
    return this.feedbackService.findAllFeedbacksFromStore(storeId);
  }

  async amountSoldProducts(storeId: string, findMostSolds: FindMostSolds) {
    return await this.productsService.amountSolds(
      storeId,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }
  async income(storeId: string, findMostSolds: FindMostSolds) {
    return await this.ordersService.income(
      storeId,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }
}
