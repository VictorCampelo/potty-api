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
exports.Payment = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const store_entity_1 = require("../../stores/store.entity");
const file_entity_1 = require("../../files/file.entity");
let Payment = class Payment extends typeorm_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, methodName: { required: true, type: () => String }, allowParcels: { required: true, type: () => Boolean }, logo: { required: true, type: () => require("../../files/file.entity").File }, store: { required: true, type: () => [require("../../stores/store.entity").Store] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar' }),
    __metadata("design:type", String)
], Payment.prototype, "methodName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "allowParcels", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => file_entity_1.File),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", file_entity_1.File)
], Payment.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => store_entity_1.Store, (store) => store.paymentMethods),
    __metadata("design:type", Array)
], Payment.prototype, "store", void 0);
Payment = __decorate([
    (0, typeorm_1.Entity)('payment'),
    (0, typeorm_1.Unique)(['methodName'])
], Payment);
exports.Payment = Payment;
//# sourceMappingURL=payments.entity.js.map