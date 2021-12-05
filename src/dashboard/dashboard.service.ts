import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { ProductsService } from 'src/products/products.service';
import { FeedbackService } from './../feedback/feedback.service';
import { OrdersService } from './../orders/orders.service';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';
import { FindMostSolds } from './dto/find-most-solds.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly feedbackService: FeedbackService,
    private readonly productsService: ProductsService,
    private readonly historicService: OrderHistoricsService,
  ) {}

  async mostSolds(storeId: string, findMostSolds: FindMostSolds) {
    return this.productsService.amountSolds(
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
  ) {
    return this.historicService.findLastSold(
      storeId,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }

  async lastFeedbacks(storeId: string) {
    return this.feedbackService.findAllFeedbacksFromStore(storeId);
  }

  async income(storeId: string, findMostSolds: FindMostSolds) {
    return this.historicService.income(
      storeId,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }

  async amountSold(storeId: string, findAmountSold: FindMostSolds) {
    const { start, end, limit, offset } = findAmountSold;
    const products = await this.productsService.productsSold(
      storeId,
      start,
      end,
      limit,
      offset,
    );

    let totalAmount = 0;
    products.forEach((p) => {
      totalAmount += parseInt(p.qtd);
    });

    return { products, totalAmount };
  }
}
