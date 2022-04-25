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
exports.OrderHistoric = void 0;
const openapi = require("@nestjs/swagger");
const product_entity_1 = require("../../products/product.entity");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../orders/order.entity");
let OrderHistoric = class OrderHistoric extends typeorm_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, storeId: { required: true, type: () => String }, productQtd: { required: true, type: () => Number }, paymentMethod: { required: true, type: () => String }, productPrice: { required: true, type: () => Number }, productParcels: { required: true, type: () => Number }, customerId: { required: true, type: () => String }, order: { required: true, type: () => require("../../orders/order.entity").Order }, orderId: { required: true, type: () => String }, product: { required: true, type: () => require("../../products/product.entity").Product }, productId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderHistoric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], OrderHistoric.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], OrderHistoric.prototype, "productQtd", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], OrderHistoric.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'float' }),
    __metadata("design:type", Number)
], OrderHistoric.prototype, "productPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata("design:type", Number)
], OrderHistoric.prototype, "productParcels", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], OrderHistoric.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.orderHistorics),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], OrderHistoric.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], OrderHistoric.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.orderHistorics),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], OrderHistoric.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], OrderHistoric.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderHistoric.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrderHistoric.prototype, "updatedAt", void 0);
OrderHistoric = __decorate([
    (0, typeorm_1.Entity)('order_historic')
], OrderHistoric);
exports.OrderHistoric = OrderHistoric;
//# sourceMappingURL=order-historic.entity.js.map