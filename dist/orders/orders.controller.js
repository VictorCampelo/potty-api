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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const stores_service_1 = require("../stores/stores.service");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_entity_1 = require("../users/user.entity");
const create_order_dto_1 = require("./dto/create-order.dto");
const orders_service_1 = require("./orders.service");
const user_roles_enum_1 = require("../users/user-roles.enum");
const role_decorator_1 = require("../auth/role.decorator");
const find_most_solds_dto_1 = require("../dashboard/dto/find-most-solds.dto");
const error_handling_1 = require("../configs/error-handling");
const find_order_dto_1 = require("./dto/find-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const swagger_1 = require("@nestjs/swagger");
let OrdersController = class OrdersController {
    constructor(ordersService, storesService) {
        this.ordersService = ordersService;
        this.storesService = storesService;
    }
    async create(createOrderDto, user) {
        try {
            const result = await this.ordersService.create(createOrderDto, user);
            return {
                orders: result.orders,
                whatsapp: result.messages,
                message: 'Order sucessfuly created',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async createGuestOrder(createOrderDto) {
        try {
            const result = await this.ordersService.create(createOrderDto);
            return {
                orders: result.orders,
                whatsapp: result.messages,
                message: 'Order sucessfuly created',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async confirmOrder(orderId, user) {
        try {
            return await this.ordersService.confirmOrder(orderId, user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAll(query, user) {
        try {
            return await this.ordersService.fillAllOrderByStatus(user.storeId, query.limit, query.offset);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOneToStore(id, user) {
        try {
            return await this.ordersService.findOneToStore(id, user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async update(updateOrderDto) {
        try {
            return await this.ordersService.updateOrderSituation(updateOrderDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAllOrdersByUser(user, query) {
        try {
            return await this.ordersService.findAllOrderByUser(user.id, query.confirmed, query.limit, query.offset);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOneToUser(id, user) {
        try {
            return await this.ordersService.findOneToUser(id, user.id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a order as a common user',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('guest'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a order as a guest user' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createGuestOrder", null);
__decorate([
    (0, common_1.Post)('store/confirm/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 201, type: require("./order.entity").Order }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirmOrder", null);
__decorate([
    (0, common_1.Get)('store'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_order_dto_1.findOrdersDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('store/order'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200, type: require("./order.entity").Order }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOneToStore", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 200, type: [require("./order.entity").Order] }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        find_most_solds_dto_1.FindMostSolds]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAllOrdersByUser", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 200, type: require("./order.entity").Order }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOneToUser", null);
OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        stores_service_1.StoresService])
], OrdersController);
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map