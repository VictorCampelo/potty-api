"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const stores_module_1 = require("../stores/stores.module");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./order.entity");
const passport_1 = require("@nestjs/passport");
const products_module_1 = require("../products/products.module");
const coupons_module_1 = require("../coupons/coupons.module");
const order_historics_module_1 = require("../order-historics/order-historics.module");
const users_module_1 = require("../users/users.module");
let OrdersModule = class OrdersModule {
    configure(consumer) {
        consumer
            .apply((req, res, next) => {
            let keys = [
                'firstName',
                'lastName',
                'uf',
                'city',
                'street',
                'neighborhood',
                'addressNumber',
                'zipcode',
                'complement',
            ];
            const guestAddress = req.body.guestAddress;
            keys.forEach((key) => {
                if (key !== 'complement' && key !== 'lastName') {
                    if (guestAddress[key] === undefined || guestAddress[key] === '') {
                        throw new common_1.HttpException('Missing address information ' + key, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                else {
                    if (guestAddress[key] === undefined)
                        guestAddress[key] = '';
                }
            });
            next();
        })
            .forRoutes('orders/guest');
    }
};
OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            products_module_1.ProductsModule,
            stores_module_1.StoresModule,
            coupons_module_1.CouponsModule,
            order_historics_module_1.OrderHistoricsModule,
            users_module_1.UsersModule,
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService],
        exports: [orders_service_1.OrdersService],
    })
], OrdersModule);
exports.OrdersModule = OrdersModule;
//# sourceMappingURL=orders.module.js.map