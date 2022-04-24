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
exports.Plan = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("../../users/user.entity");
const typeorm_1 = require("typeorm");
let Plan = class Plan {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, nickname: { required: true, type: () => String }, url: { required: true, type: () => String }, code: { required: true, type: () => Number }, price: { required: true, type: () => Number }, users: { required: true, type: () => [require("../../users/user.entity").User] }, qtd_products: { required: true, type: () => Number } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Plan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Plan.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Plan.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'integer' }),
    __metadata("design:type", Number)
], Plan.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Plan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.plan),
    __metadata("design:type", Array)
], Plan.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "qtd_products", void 0);
Plan = __decorate([
    (0, typeorm_1.Entity)('plan'),
    (0, typeorm_1.Unique)(['code'])
], Plan);
exports.Plan = Plan;
//# sourceMappingURL=plan.entity.js.map