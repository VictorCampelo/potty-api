"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModule = void 0;
const orders_module_1 = require("./../orders/orders.module");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const feedback_entity_1 = require("./feedback.entity");
const feedback_controller_1 = require("./feedback.controller");
const feedback_service_1 = require("./feedback.service");
const products_module_1 = require("../products/products.module");
const stores_module_1 = require("../stores/stores.module");
let FeedbackModule = class FeedbackModule {
};
FeedbackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([feedback_entity_1.Feedback]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            products_module_1.ProductsModule,
            stores_module_1.StoresModule,
            orders_module_1.OrdersModule,
        ],
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService],
        exports: [feedback_service_1.FeedbackService],
    })
], FeedbackModule);
exports.FeedbackModule = FeedbackModule;
//# sourceMappingURL=feedback.module.js.map