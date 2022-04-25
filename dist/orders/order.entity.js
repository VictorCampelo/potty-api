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
exports.Order = void 0;
const openapi = require("@nestjs/swagger");
const order_historic_entity_1 = require("./../order-historics/entities/order-historic.entity");
const coupon_entity_1 = require("./../coupons/entities/coupon.entity");
const store_entity_1 = require("../stores/store.entity");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("typeorm");
let Order = class Order extends typeorm_1.BaseEntity {
    generateOrderNumber() {
        this.orderNumber = (Math.floor(Math.random() * 999999999) + 1).toString();
        if (this.orderNumber.length < 9) {
            this.orderNumber =
                '0'.repeat(9 - this.orderNumber.length) + this.orderNumber;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user: { required: true, type: () => require("../users/user.entity").User }, orderNumber: { required: true, type: () => String }, userId: { required: true, type: () => String }, coupon: { required: true, type: () => require("../coupons/entities/coupon.entity").Coupon }, couponId: { required: true, type: () => String }, orderHistorics: { required: true, type: () => [require("../order-historics/entities/order-historic.entity").OrderHistoric] }, store: { required: true, type: () => require("../stores/store.entity").Store }, storeId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, status: { required: true, type: () => Boolean }, situation: { required: true, type: () => Object }, requiresDelivery: { required: false, type: () => Boolean }, customerAddress: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.order),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, name: 'user_id' }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coupon_entity_1.Coupon, (coupon) => coupon.orders),
    __metadata("design:type", coupon_entity_1.Coupon)
], Order.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_historic_entity_1.OrderHistoric, (orderHistoric) => orderHistoric.order),
    __metadata("design:type", Array)
], Order.prototype, "orderHistorics", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.orders),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Order.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, name: 'store_id' }),
    __metadata("design:type", String)
], Order.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'float' }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', default: 'Recebido' }),
    __metadata("design:type", String)
], Order.prototype, "situation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "requiresDelivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Order.prototype, "generateOrderNumber", null);
Order = __decorate([
    (0, typeorm_1.Entity)('order')
], Order);
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map