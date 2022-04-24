"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const order_historics_service_1 = require("./../order-historics/order-historics.service");
const products_service_1 = require("../products/products.service");
const feedback_service_1 = require("./../feedback/feedback.service");
const orders_service_1 = require("./../orders/orders.service");
const common_1 = require("@nestjs/common");
const data_1 = require("@google-analytics/data");
const stores_service_1 = require("../stores/stores.service");
let DashboardService = class DashboardService {
    constructor(ordersService, feedbackService, productsService, historicService, storesService) {
        this.ordersService = ordersService;
        this.feedbackService = feedbackService;
        this.productsService = productsService;
        this.historicService = historicService;
        this.storesService = storesService;
    }
    async mostSolds(storeId, findMostSolds) {
        return this.historicService.amountSolds(storeId, findMostSolds.start, findMostSolds.end, findMostSolds.limit, findMostSolds.offset);
    }
    async lastSolds(storeId, findMostSolds) {
        return this.historicService.findLastSold(storeId, findMostSolds.limit, findMostSolds.offset);
    }
    async lastFeedbacks(storeId) {
        return this.feedbackService.findAllFeedbacksFromStore(storeId);
    }
    async income(storeId, findMostSolds) {
        return this.historicService.income(storeId, findMostSolds.start, findMostSolds.end, findMostSolds.limit, findMostSolds.offset);
    }
    async amountSold(storeId, findAmountSold) {
        const { start, end, limit, offset } = findAmountSold;
        const products = await this.productsService.productsSold(storeId, start, end, limit, offset);
        let totalAmount = 0;
        products.forEach((p) => {
            if (!p.files[0]) {
                p.files = [];
            }
            totalAmount += parseInt(p.qtd);
        });
        return { products, totalAmount };
    }
    async getviewer(query, storeId) {
        const store = await this.storesService.findOne(storeId);
        if (!store) {
            throw new common_1.HttpException('User does not have store', common_1.HttpStatus.BAD_REQUEST);
        }
        const analyticsDataClient = new data_1.BetaAnalyticsDataClient();
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
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        feedback_service_1.FeedbackService,
        products_service_1.ProductsService,
        order_historics_service_1.OrderHistoricsService,
        stores_service_1.StoresService])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map