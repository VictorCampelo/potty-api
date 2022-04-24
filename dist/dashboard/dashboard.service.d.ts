import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { ProductsService } from 'src/products/products.service';
import { FeedbackService } from './../feedback/feedback.service';
import { OrdersService } from './../orders/orders.service';
import { FindMostSolds } from './dto/find-most-solds.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { StoresService } from 'src/stores/stores.service';
export declare class DashboardService {
    private readonly ordersService;
    private readonly feedbackService;
    private readonly productsService;
    private readonly historicService;
    private readonly storesService;
    constructor(ordersService: OrdersService, feedbackService: FeedbackService, productsService: ProductsService, historicService: OrderHistoricsService, storesService: StoresService);
    mostSolds(storeId: string, findMostSolds: FindMostSolds): Promise<any>;
    lastSolds(storeId: string, findMostSolds: FindMostSolds): Promise<import("../order-historics/entities/order-historic.entity").OrderHistoric[]>;
    lastFeedbacks(storeId: string): Promise<import("../feedback/feedback.entity").Feedback[]>;
    income(storeId: string, findMostSolds: FindMostSolds): Promise<any>;
    amountSold(storeId: string, findAmountSold: FindMostSolds): Promise<{
        products: any[];
        totalAmount: number;
    }>;
    getviewer(query: AnalyticsDto, storeId: string): Promise<{
        message: string;
        subdomain?: undefined;
        since?: undefined;
        until?: undefined;
        totalViews?: undefined;
        perCity?: undefined;
    } | {
        subdomain: string;
        since: string;
        until: string;
        totalViews: number;
        perCity: any[];
        message?: undefined;
    }>;
}
