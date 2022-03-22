import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { ProductsService } from 'src/products/products.service';
import { FeedbackService } from './../feedback/feedback.service';
import { OrdersService } from './../orders/orders.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.entity';
import { FindMostSolds } from './dto/find-most-solds.dto';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { AnalyticsDto } from './dto/analytics.dto';
import { StoresService } from 'src/stores/stores.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly feedbackService: FeedbackService,
    private readonly productsService: ProductsService,
    private readonly historicService: OrderHistoricsService,
    private readonly storesService: StoresService,
  ) {}

  async mostSolds(storeId: string, findMostSolds: FindMostSolds) {
    return this.historicService.amountSolds(
      storeId,
      findMostSolds.start,
      findMostSolds.end,
      findMostSolds.limit,
      findMostSolds.offset,
    );
  }

  async lastSolds(storeId: string, findMostSolds: FindMostSolds) {
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
      if (!p.files[0]) {
        p.files = [];
      }
      totalAmount += parseInt(p.qtd);
    });

    return { products, totalAmount };
  }

  async getviewer(query: AnalyticsDto, storeId: string) {
    const store = await this.storesService.findOne(storeId);

    if (!store) {
      throw new HttpException(
        'User does not have store',
        HttpStatus.BAD_REQUEST,
      );
    }

    const analyticsDataClient = new BetaAnalyticsDataClient();
    let since = query.since;
    let until = query.until;

    if (query.since) {
      let sinceSplited = query.since.split('/');
      query.since =
        sinceSplited[2] + '-' + sinceSplited[1] + '-' + sinceSplited[0];
    }

    if (query.until) {
      let untilSplited = query.until.split('/');
      query.until =
        untilSplited[2] + '-' + untilSplited[1] + '-' + untilSplited[0];
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/306671875`,
      dateRanges: [
        {
          startDate: query.since ? query.since : '2022-03-15',
          endDate: query.until ? query.until : 'today',
        },
      ],
      dimensions: [
        {
          name: 'hostname',
        },
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    let subdm = store.formatedName;
    let totalViews = 0;
    let subdomainStatistics = [];
    response.rows.forEach((row) => {
      const splitedHostnames = row.dimensionValues[0].value.split('.');

      if (splitedHostnames.length > 3 && splitedHostnames[0] === subdm) {
        let viewsInt = parseInt(row.metricValues[0].value);
        subdomainStatistics.push({
          from: row.dimensionValues[1].value,
          seen: viewsInt,
        });
        totalViews += viewsInt;
      }
    });

    if (subdomainStatistics.length === 0) {
      return { message: 'No statistics available' };
    }

    subdomainStatistics.sort((a, b) => {
      return b.seen - a.seen;
    });

    return {
      subdomain: subdm,
      since: since ? since : 'beginning',
      until: until ? until : 'today',
      totalViews,
      perCity: subdomainStatistics,
    };
  }
}
