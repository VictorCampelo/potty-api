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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("../users/user.entity");
const find_most_solds_dto_1 = require("./dto/find-most-solds.dto");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_roles_enum_1 = require("../users/user-roles.enum");
const dashboard_service_1 = require("./dashboard.service");
const error_handling_1 = require("../configs/error-handling");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const analytics_dto_1 = require("./dto/analytics.dto");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async findMostSoldsProducts(query, user) {
        try {
            return await this.dashboardService.mostSolds(user.storeId, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findLastSoldsProducts(query, user) {
        try {
            return await this.dashboardService.lastSolds(user.storeId, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findFeedbacks(query, user) {
        try {
            return await this.dashboardService.lastFeedbacks(user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAmountSoldProducts(query, user) {
        try {
            return await this.dashboardService.amountSold(user.storeId, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findIncome(query, user) {
        try {
            return await this.dashboardService.income(user.storeId, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async getViewer(query, user) {
        try {
            return await this.dashboardService.getviewer(query, user.storeId);
        }
        catch (error) {
            throw new common_1.HttpException('Check the query values and try again', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('mostSolds'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_most_solds_dto_1.FindMostSolds,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "findMostSoldsProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('lastSolds'),
    openapi.ApiResponse({ status: 200, type: [require("../order-historics/entities/order-historic.entity").OrderHistoric] }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_most_solds_dto_1.FindMostSolds,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "findLastSoldsProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('lastFeedbacks'),
    openapi.ApiResponse({ status: 200, type: [require("../feedback/feedback.entity").Feedback] }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_most_solds_dto_1.FindMostSolds,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "findFeedbacks", null);
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('amountSoldProducts'),
    (0, swagger_1.ApiQuery)({
        name: 'start',
        type: 'string',
        example: '2022-11-24 10:07:10',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end',
        type: 'string',
        example: '2022-11-27 12:07:10',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: 'string', example: 10, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'offset', type: 'string', example: 0, required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_most_solds_dto_1.FindMostSolds,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "findAmountSoldProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('income'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_most_solds_dto_1.FindMostSolds,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "findIncome", null);
__decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Get)('getviewer'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.AnalyticsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getViewer", null);
DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map