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
exports.Coupon = void 0;
const openapi = require("@nestjs/swagger");
const store_entity_1 = require("./../../stores/store.entity");
const order_entity_1 = require("./../../orders/order.entity");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const category_entity_1 = require("../../categories/category.entity");
let Coupon = class Coupon extends typeorm_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, code: { required: true, type: () => String }, type: { required: true, type: () => Object }, range: { required: true, type: () => Object }, discountPorcent: { required: true, type: () => Number }, discountValue: { required: true, type: () => Number }, maxUsage: { required: true, type: () => Number }, isExpired: { required: true, type: () => Boolean }, isPrivate: { required: true, type: () => Boolean }, isLimited: { required: true, type: () => Boolean }, validate: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, categories: { required: true, type: () => [require("../../categories/category.entity").Category] }, orders: { required: true, type: () => [require("../../orders/order.entity").Order] }, store: { required: true, type: () => require("../../stores/store.entity").Store }, storeId: { required: true, type: () => String }, users: { required: true, type: () => [require("../../users/user.entity").User] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Coupon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], Coupon.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], Coupon.prototype, "range", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "discountPorcent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxUsage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isExpired", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isPrivate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isLimited", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Coupon.prototype, "validate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Coupon.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Coupon.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, (category) => category.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.coupons),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Coupon.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, name: 'store_id' }),
    __metadata("design:type", String)
], Coupon.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.coupons),
    (0, typeorm_1.JoinTable)({ name: 'user_coupons_used' }),
    __metadata("design:type", Array)
], Coupon.prototype, "users", void 0);
Coupon = __decorate([
    (0, typeorm_1.Entity)('coupon')
], Coupon);
exports.Coupon = Coupon;
//# sourceMappingURL=coupon.entity.js.map