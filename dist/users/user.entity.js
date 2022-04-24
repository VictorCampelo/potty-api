"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const openapi = require("@nestjs/swagger");
const coupon_entity_1 = require("./../coupons/entities/coupon.entity");
const feedback_entity_1 = require("../feedback/feedback.entity");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const file_entity_1 = require("../files/file.entity");
const order_entity_1 = require("../orders/order.entity");
const store_entity_1 = require("../stores/store.entity");
const plan_entity_1 = require("../plans/entities/plan.entity");
const buyerhistory_entity_1 = require("../buyerhistory/entities/buyerhistory.entity");
let User = class User extends typeorm_1.BaseEntity {
    async checkPassword(password) {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, role: { required: true, type: () => String }, enabled: { required: true, type: () => Boolean }, password: { required: true, type: () => String }, salt: { required: true, type: () => String }, confirmationToken: { required: true, type: () => String }, confirmationTokenDigits: { required: true, type: () => String }, recoverToken: { required: true, type: () => String }, recoverTokenDigits: { required: true, type: () => String }, hasAcceptedTerms: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, files: { required: true, type: () => [require("../files/file.entity").File] }, profileImage: { required: true, type: () => require("../files/file.entity").File }, order: { required: true, type: () => [require("../orders/order.entity").Order] }, feedbacks: { required: true, type: () => [require("../feedback/feedback.entity").Feedback] }, storeId: { required: true, type: () => String }, store: { required: true, type: () => require("../stores/store.entity").Store }, likedstores: { required: true, type: () => [require("../stores/store.entity").Store] }, coupons: { required: true, type: () => [require("../coupons/entities/coupon.entity").Coupon] }, zipcode: { required: false, type: () => String }, street: { required: false, type: () => String }, addressNumber: { required: false, type: () => Number }, neighborhood: { required: false, type: () => String }, complement: { required: false, type: () => String }, city: { required: false, type: () => String }, uf: { required: false, type: () => String }, logradouro: { required: false, type: () => String }, plan: { required: true, type: () => require("../plans/entities/plan.entity").Plan }, planId: { required: true, type: () => String }, buyerhistories: { required: true, type: () => [require("../buyerhistory/entities/buyerhistory.entity").BuyerHistory] }, googleId: { required: false, type: () => String }, facebookId: { required: false, type: () => String } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], User.prototype, "confirmationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], User.prototype, "confirmationTokenDigits", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], User.prototype, "recoverToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], User.prototype, "recoverTokenDigits", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasAcceptedTerms", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_entity_1.File, (file) => file.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => file_entity_1.File),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", file_entity_1.File)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.user),
    __metadata("design:type", Array)
], User.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.user),
    __metadata("design:type", Array)
], User.prototype, "feedbacks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.owners),
    __metadata("design:type", store_entity_1.Store)
], User.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => store_entity_1.Store, (stores) => stores.usersWhoLiked),
    __metadata("design:type", Array)
], User.prototype, "likedstores", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => coupon_entity_1.Coupon, (coupon) => coupon.users),
    __metadata("design:type", Array)
], User.prototype, "coupons", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "zipcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "addressNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "neighborhood", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "complement", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "uf", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "logradouro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plan_entity_1.Plan, (plan) => plan.users),
    (0, typeorm_1.JoinColumn)({ name: 'plan_id' }),
    __metadata("design:type", plan_entity_1.Plan)
], User.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, name: 'plan_id' }),
    __metadata("design:type", String)
], User.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => buyerhistory_entity_1.BuyerHistory, (bh) => bh.user),
    __metadata("design:type", Array)
], User.prototype, "buyerhistories", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
User = __decorate([
    (0, typeorm_1.Entity)('user'),
    (0, typeorm_1.Unique)(['email'])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map