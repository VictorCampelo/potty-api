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
exports.Product = void 0;
const openapi = require("@nestjs/swagger");
const feedback_entity_1 = require("../feedback/feedback.entity");
const store_entity_1 = require("../stores/store.entity");
const typeorm_1 = require("typeorm");
const file_entity_1 = require("../files/file.entity");
const category_entity_1 = require("../categories/category.entity");
const order_historic_entity_1 = require("../order-historics/entities/order-historic.entity");
let Product = class Product extends typeorm_1.BaseEntity {
    calculateDiscount() {
        let value = this.price * (this.discount / 100 - 1);
        this.priceWithDiscount =
            value > 0
                ? parseFloat(value.toFixed(2))
                : parseFloat((value * -1).toFixed(2));
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, price: { required: true, type: () => Number }, priceWithDiscount: { required: true, type: () => Number }, discount: { required: true, type: () => Number }, sumOrders: { required: false, type: () => Number }, sumFeedbacks: { required: false, type: () => Number }, sumStars: { required: false, type: () => Number }, avgStars: { required: false, type: () => Number }, inventory: { required: true, type: () => Number }, lastSold: { required: false, type: () => Date }, parcelAmount: { required: false, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: false, type: () => Date }, store: { required: true, type: () => require("../stores/store.entity").Store }, storeId: { required: true, type: () => String }, files: { required: true, type: () => [require("../files/file.entity").File] }, categories: { required: true, type: () => [require("../categories/category.entity").Category] }, feedbacks: { required: true, type: () => [require("../feedback/feedback.entity").Feedback] }, orderHistorics: { required: true, type: () => [require("../order-historics/entities/order-historic.entity").OrderHistoric] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 800 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-array' }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Product.prototype, "priceWithDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Product.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sumOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sumFeedbacks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sumStars", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, type: 'float' }),
    __metadata("design:type", Number)
], Product.prototype, "avgStars", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'timestamptz' }),
    __metadata("design:type", Date)
], Product.prototype, "lastSold", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "parcelAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.products),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Product.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, name: 'store_id' }),
    __metadata("design:type", String)
], Product.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_entity_1.File, (file) => file.product),
    __metadata("design:type", Array)
], Product.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.products),
    (0, typeorm_1.JoinTable)({ name: 'products_categories' }),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.product),
    __metadata("design:type", Array)
], Product.prototype, "feedbacks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_historic_entity_1.OrderHistoric, (orderHistoric) => orderHistoric.product),
    __metadata("design:type", Array)
], Product.prototype, "orderHistorics", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "calculateDiscount", null);
Product = __decorate([
    (0, typeorm_1.Entity)('product'),
    (0, typeorm_1.Unique)(['id', 'title'])
], Product);
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map