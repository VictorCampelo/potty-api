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
exports.CreateCouponDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCouponDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String }, maxUsage: { required: true, type: () => Number }, discountPorcent: { required: true, type: () => Number, minimum: 0, maximum: 100 }, discountValue: { required: false, type: () => Number, minimum: 0 }, validate: { required: false, type: () => Date }, type: { required: true, type: () => Object, pattern: /money|percentage/ }, range: { required: true, type: () => Object, pattern: /category|store|first-buy/ }, isLimited: { required: false, type: () => Boolean }, isPrivate: { required: false, type: () => Boolean }, categoriesIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "discountPorcent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "discountValue", void 0);
__decorate([
    (0, class_validator_1.Matches)(/money|percentage/, { message: 'Invalid coupom type' }),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.Matches)(/category|store|first-buy/, { message: 'Invalid coupom range' }),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "range", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCouponDto.prototype, "isLimited", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCouponDto.prototype, "isPrivate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCouponDto.prototype, "categoriesIds", void 0);
exports.CreateCouponDto = CreateCouponDto;
//# sourceMappingURL=create-coupon.dto.js.map