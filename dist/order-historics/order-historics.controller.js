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
exports.OrderHistoricsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const order_historics_service_1 = require("./order-historics.service");
const create_order_historic_dto_1 = require("./dto/create-order-historic.dto");
const update_order_historic_dto_1 = require("./dto/update-order-historic.dto");
const swagger_1 = require("@nestjs/swagger");
let OrderHistoricsController = class OrderHistoricsController {
    constructor(orderHistoricsService) {
        this.orderHistoricsService = orderHistoricsService;
    }
    create(createOrderHistoricDto) {
        return this.orderHistoricsService.create(createOrderHistoricDto);
    }
    findAll() {
        return this.orderHistoricsService.findAll();
    }
    findOne(id) {
        return this.orderHistoricsService.findOne(id);
    }
    update(id, updateOrderHistoricDto) {
        return this.orderHistoricsService.update(+id, updateOrderHistoricDto);
    }
    remove(id) {
        return this.orderHistoricsService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./entities/order-historic.entity").OrderHistoric }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_historic_dto_1.CreateOrderHistoricDto]),
    __metadata("design:returntype", void 0)
], OrderHistoricsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderHistoricsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/order-historic.entity").OrderHistoric }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderHistoricsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_historic_dto_1.UpdateOrderHistoricDto]),
    __metadata("design:returntype", void 0)
], OrderHistoricsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderHistoricsController.prototype, "remove", null);
OrderHistoricsController = __decorate([
    (0, swagger_1.ApiTags)('order-historics'),
    (0, common_1.Controller)('order-historics'),
    __metadata("design:paramtypes", [order_historics_service_1.OrderHistoricsService])
], OrderHistoricsController);
exports.OrderHistoricsController = OrderHistoricsController;
//# sourceMappingURL=order-historics.controller.js.map