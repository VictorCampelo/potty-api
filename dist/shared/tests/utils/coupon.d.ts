import { Coupon } from "src/coupons/entities/coupon.entity";
import { CouponRange, CouponDiscountType } from "./dto";
export default class CouponUtils {
    static giveMeAValidCoupon(code?: string, isExpired?: boolean, maxUsage?: number, storeId?: string, range?: CouponRange, categoriesIds?: string[], type?: CouponDiscountType, discount?: number): Coupon;
}
