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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const coupons_repository_1 = require("./coupons.repository");
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../categories/categories.service");
const lodash_1 = __importDefault(require("lodash"));
let CouponsService = class CouponsService {
    constructor(couponRepository, categoriesService) {
        this.couponRepository = couponRepository;
        this.categoriesService = categoriesService;
    }
    async create(createCouponDto, storeId) {
        const coupon = this.couponRepository.create();
        createCouponDto['storeId'] = storeId;
        coupon.code = createCouponDto.code;
        coupon.maxUsage = createCouponDto.maxUsage;
        coupon.type = createCouponDto.type;
        coupon.discountPorcent =
            createCouponDto.discountPorcent && createCouponDto.discountPorcent / 100;
        coupon.discountValue = createCouponDto.discountValue;
        coupon.validate = createCouponDto.validate;
        coupon.range = createCouponDto.range;
        coupon.isLimited = createCouponDto.isLimited;
        coupon.isPrivate = createCouponDto.isPrivate;
        coupon.storeId = storeId;
        if (createCouponDto.categoriesIds) {
            coupon.categories = await this.categoriesService.findAllByIds(createCouponDto.categoriesIds);
        }
        return this.couponRepository.save(coupon);
    }
    async checkCoupom(code, storeId) {
        return this.couponRepository.findOne({
            where: {
                code,
                storeId,
                isExpired: false,
            },
        });
    }
    async findAll(storeId) {
        return this.couponRepository.find({
            where: {
                storeId,
            },
        });
    }
    async findOne(code) {
        return this.couponRepository.findOne({
            where: {
                code,
            },
            relations: ['categories'],
        });
    }
    async findLocal(code, storeId) {
        return this.couponRepository.findOne({
            where: {
                code,
                storeId,
            },
        });
    }
    async decreaseUsedCoupon(coupon) {
        coupon.maxUsage -= 1;
        return this.couponRepository.save(coupon);
    }
    async update(updateCouponDto, storeId, couponCode) {
        const coupon = await this.findLocal(couponCode, storeId);
        if (!coupon) {
            throw new common_1.HttpException("The Coupon you're trying to update doesn't belong to your Store", common_1.HttpStatus.FORBIDDEN);
        }
        if (updateCouponDto.categoriesIds) {
            coupon.categories = await this.categoriesService.findAllByIds(updateCouponDto.categoriesIds);
            updateCouponDto = lodash_1.default.omit(updateCouponDto, 'categoriesIds');
            await coupon.save();
        }
        return this.couponRepository.update(coupon.id, updateCouponDto);
    }
    async remove(couponCode, storeId) {
        const coupon = await this.findLocal(couponCode, storeId);
        if (!coupon) {
            throw new common_1.HttpException("The Coupon you're trying to update doesn't belong to your Store", common_1.HttpStatus.FORBIDDEN);
        }
        return this.couponRepository.delete(coupon.id);
    }
};
CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [coupons_repository_1.CouponRepository,
        categories_service_1.CategoriesService])
], CouponsService);
exports.CouponsService = CouponsService;
//# sourceMappingURL=coupons.service.js.map