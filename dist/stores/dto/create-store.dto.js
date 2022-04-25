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
exports.defaultSchedules = exports.CreateStoreDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStoreDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, CNPJ: { required: true, type: () => String }, phone: { required: true, type: () => String }, addressNumber: { required: true, type: () => Number }, zipcode: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, description: { required: true, type: () => String }, facebookLink: { required: false, type: () => String }, instagramLink: { required: false, type: () => String }, whatsappLink: { required: false, type: () => String }, shedules: { required: false, type: () => Object }, deliveryFee: { required: false, type: () => Number }, avatar: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "CNPJ", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "addressNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "zipcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "facebookLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "instagramLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "whatsappLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CreateStoreDto.prototype, "shedules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateStoreDto.prototype, "deliveryFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateStoreDto.prototype, "avatar", void 0);
exports.CreateStoreDto = CreateStoreDto;
exports.defaultSchedules = {
    seg: ['06:00', '20:00'],
    ter: ['06:00', '20:00'],
    qua: ['06:00', '20:00'],
    qui: ['06:00', '20:00'],
    sex: ['06:00', '20:00'],
    sab: ['07:00', '12:00'],
    dom: ['07:00', '12:00'],
};
//# sourceMappingURL=create-store.dto.js.map