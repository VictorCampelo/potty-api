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
exports.UniqueUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UniqueUpdateDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { product_id: { required: false, type: () => String }, toBeDeleted: { required: false, type: () => [String] }, title: { required: false, type: () => String }, description: { required: false, type: () => String }, tags: { required: false, type: () => [String] }, categoriesIds: { required: false, type: () => [String] }, files: { required: false, type: () => [Object] }, price: { required: false, type: () => Number, minimum: 0 }, inventory: { required: true, type: () => Number, minimum: 0 }, discount: { required: false, type: () => Number, minimum: 0, maximum: 100 }, parcelAmount: { required: false, type: () => Number, minimum: 1 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UniqueUpdateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UniqueUpdateDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string'
        ? value.replace(']', '').replace('[', '').replaceAll('"', '').split(',')
        : value),
    __metadata("design:type", Array)
], UniqueUpdateDto.prototype, "categoriesIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UniqueUpdateDto.prototype, "files", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UniqueUpdateDto.prototype, "price", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UniqueUpdateDto.prototype, "inventory", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UniqueUpdateDto.prototype, "discount", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UniqueUpdateDto.prototype, "parcelAmount", void 0);
exports.UniqueUpdateDto = UniqueUpdateDto;
//# sourceMappingURL=unique-update.dto.js.map