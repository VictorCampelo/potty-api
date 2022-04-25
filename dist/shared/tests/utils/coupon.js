"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_entity_1 = require("../../../coupons/entities/coupon.entity");
const category_1 = __importDefault(require("./category"));
const dto_1 = require("./dto");
class CouponUtils {
    static giveMeAValidCoupon(code = 'cupom', isExpired = false, maxUsage = 100, storeId = '1', range = dto_1.CouponRange.category, categoriesIds = ['1'], type = dto_1.CouponDiscountType.money, discount = 5) {
        const coupon = new coupon_entity_1.Coupon();
        coupon.code = code;
        coupon.isExpired = isExpired;
        coupon.maxUsage = maxUsage;
        coupon.storeId = storeId;
        coupon.range = range;
        coupon.type = type;
        if (type === dto_1.CouponDiscountType.money) {
            coupon.discountValue = discount;
        }
        else {
            coupon.discountPorcent = discount / 100;
        }
        categoriesIds.forEach((ctgId) => {
            if (!coupon.categories) {
                coupon.categories = [category_1.default.giveMeAValidCategory(ctgId)];
            }
            coupon.categories.push(category_1.default.giveMeAValidCategory(ctgId));
        });
        return coupon;
    }
}
exports.default = CouponUtils;
//# sourceMappingURL=coupon.js.map