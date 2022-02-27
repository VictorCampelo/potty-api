import { Coupon } from "src/coupons/entities/coupon.entity";
import CategoryUtils from "./category";
import { CouponRange, CouponDiscountType } from "./dto";

export default class CouponUtils {

  static giveMeAValidCoupon(
    code = 'cupom',
    isExpired = false,
    maxUsage = 100,
    storeId = '1',
    range = CouponRange.category,
    categoriesIds = ['1'],
    type = CouponDiscountType.money,
    discount = 5,
  ): Coupon {
    const coupon = new Coupon();
    coupon.code = code;
    coupon.isExpired = isExpired;
    coupon.maxUsage = maxUsage;
    coupon.storeId = storeId;
    coupon.range = range;
    coupon.type = type;
    if (type === CouponDiscountType.money) {
      coupon.discountValue = discount;
    } else {
      coupon.discountPorcent = discount / 100;
    }
    // ToDo: validar qdo for tipo Money e não tiver valor (cadastro do cupom)
    categoriesIds.forEach((ctgId) => {
      if (!coupon.categories) {
        coupon.categories = [CategoryUtils.giveMeAValidCategory(ctgId)];
      }
      coupon.categories.push(CategoryUtils.giveMeAValidCategory(ctgId));
    });

    return coupon;
  }


}
