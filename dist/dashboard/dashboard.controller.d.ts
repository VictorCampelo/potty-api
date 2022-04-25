import { User } from 'src/users/user.entity';
import { FindMostSolds } from './dto/find-most-solds.dto';
import { DashboardService } from './dashboard.service';
import { AnalyticsDto } from './dto/analytics.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    findMostSoldsProducts(query: FindMostSolds, user: User): Promise<any>;
    findLastSoldsProducts(query: FindMostSolds, user: User): Promise<import("../order-historics/entities/order-historic.entity").OrderHistoric[]>;
    findFeedbacks(query: FindMostSolds, user: User): Promise<import("../feedback/feedback.entity").Feedback[]>;
    findAmountSoldProducts(query: FindMostSolds, user: User): Promise<{
        products: any[];
        totalAmount: number;
    }>;
    findIncome(query: FindMostSolds, user: User): Promise<any>;
    getViewer(query: AnalyticsDto, user: User): Promise<{
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
