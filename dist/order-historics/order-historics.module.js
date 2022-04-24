"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoricsModule = void 0;
const common_1 = require("@nestjs/common");
const order_historics_service_1 = require("./order-historics.service");
const order_historics_controller_1 = require("./order-historics.controller");
const typeorm_1 = require("@nestjs/typeorm");
const order_historic_entity_1 = require("./entities/order-historic.entity");
let OrderHistoricsModule = class OrderHistoricsModule {
};
OrderHistoricsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([order_historic_entity_1.OrderHistoric])],
        controllers: [order_historics_controller_1.OrderHistoricsController],
        providers: [order_historics_service_1.OrderHistoricsService],
        exports: [order_historics_service_1.OrderHistoricsService],
    })
], OrderHistoricsModule);
exports.OrderHistoricsModule = OrderHistoricsModule;
//# sourceMappingURL=order-historics.module.js.map