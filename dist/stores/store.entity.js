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
exports.Store = void 0;
const openapi = require("@nestjs/swagger");
const uuid_1 = require("uuid");
const coupon_entity_1 = require("./../coupons/entities/coupon.entity");
const scheduleProperties_interface_1 = require("./types/scheduleProperties.interface");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../products/product.entity");
const file_entity_1 = require("../files/file.entity");
const category_entity_1 = require("../categories/category.entity");
const user_entity_1 = require("../users/user.entity");
const order_entity_1 = require("../orders/order.entity");
const create_store_dto_1 = require("./dto/create-store.dto");
const payments_entity_1 = require("../payments/entities/payments.entity");
let Store = class Store extends typeorm_1.BaseEntity {
    setId() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, formatedName: { required: true, type: () => String }, CNPJ: { required: true, type: () => String }, phone: { required: true, type: () => String }, street: { required: false, type: () => String }, zipcode: { required: false, type: () => String }, addressNumber: { required: false, type: () => Number }, neighborhood: { required: false, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, description: { required: false, type: () => String }, enabled: { required: true, type: () => Boolean }, sumOrders: { required: false, type: () => Number }, sumFeedbacks: { required: false, type: () => Number }, sumStars: { required: false, type: () => Number }, avgStars: { required: false, type: () => Number }, facebookLink: { required: true, type: () => String }, instagramLink: { required: true, type: () => String }, whatsappLink: { required: true, type: () => String }, schedules: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, products: { required: true, type: () => [require("../products/product.entity").Product] }, avatar: { required: true, type: () => require("../files/file.entity").File }, background: { required: true, type: () => require("../files/file.entity").File }, files: { required: true, type: () => [require("../files/file.entity").File] }, categories: { required: true, type: () => [require("../categories/category.entity").Category] }, productCategories: { required: true, type: () => [require("../categories/category.entity").Category] }, owners: { required: true, type: () => [require("../users/user.entity").User] }, coupons: { required: true, type: () => [require("../coupons/entities/coupon.entity").Coupon] }, usersWhoLiked: { required: true, type: () => [require("../users/user.entity").User] }, likes: { required: true, type: () => Number }, deliveryFee: { required: true, type: () => Number }, dispatch: { required: true, enum: require("./types/scheduleProperties.interface").DispatchTypes }, orders: { required: true, type: () => [require("../orders/order.entity").Order] }, paymentMethods: { required: true, type: () => [require("../payments/entities/payments.entity").Payment] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Store.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: 'varchar',
        length: 45,
        name: 'formated_name',
    }),
    __metadata("design:type", String)
], Store.prototype, "formatedName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], Store.prototype, "CNPJ", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], Store.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "zipcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Store.prototype, "addressNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "neighborhood", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], Store.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 45 }),
    __metadata("design:type", String)
], Store.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 256 }),
    __metadata("design:type", String)
], Store.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, name: 'sum_orders' }),
    __metadata("design:type", Number)
], Store.prototype, "sumOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, name: 'sum_feedbacks' }),
    __metadata("design:type", Number)
], Store.prototype, "sumFeedbacks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, name: 'sum_stars' }),
    __metadata("design:type", Number)
], Store.prototype, "sumStars", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0, name: 'avg_stars', type: 'float' }),
    __metadata("design:type", Number)
], Store.prototype, "avgStars", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'varchar',
        length: 45,
        name: 'facebook_link',
    }),
    __metadata("design:type", String)
], Store.prototype, "facebookLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'varchar',
        length: 45,
        name: 'instagram_link',
    }),
    __metadata("design:type", String)
], Store.prototype, "instagramLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'varchar',
        length: 45,
        name: 'whatsapp_link',
    }),
    __metadata("design:type", String)
], Store.prototype, "whatsappLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'jsonb', default: create_store_dto_1.defaultSchedules }),
    __metadata("design:type", Object)
], Store.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.store),
    __metadata("design:type", Array)
], Store.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => file_entity_1.File),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", file_entity_1.File)
], Store.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => file_entity_1.File),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", file_entity_1.File)
], Store.prototype, "background", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_entity_1.File, (file) => file.user),
    __metadata("design:type", Array)
], Store.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.store),
    (0, typeorm_1.JoinTable)({ name: 'store_category' }),
    __metadata("design:type", Array)
], Store.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, (category) => category.storeProducts),
    __metadata("design:type", Array)
], Store.prototype, "productCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.store),
    __metadata("design:type", Array)
], Store.prototype, "owners", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => coupon_entity_1.Coupon, (coupon) => coupon.store),
    __metadata("design:type", Array)
], Store.prototype, "coupons", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)({ name: 'favorites' }),
    __metadata("design:type", Array)
], Store.prototype, "usersWhoLiked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Store.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0.0 }),
    __metadata("design:type", Number)
], Store.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: scheduleProperties_interface_1.DispatchTypes,
        default: scheduleProperties_interface_1.DispatchTypes.WITHDRAWAL,
    }),
    __metadata("design:type", String)
], Store.prototype, "dispatch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.store),
    __metadata("design:type", Array)
], Store.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => payments_entity_1.Payment, (payment) => payment.store),
    (0, typeorm_1.JoinTable)({ name: 'store_payment' }),
    __metadata("design:type", Array)
], Store.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Store.prototype, "setId", null);
Store = __decorate([
    (0, typeorm_1.Entity)('store'),
    (0, typeorm_1.Unique)(['name'])
], Store);
exports.Store = Store;
//# sourceMappingURL=store.entity.js.map