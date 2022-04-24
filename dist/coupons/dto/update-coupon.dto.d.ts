import { CreateCouponDto } from './create-coupon.dto';
declare const UpdateCouponDto_base: import("@nestjs/common").Type<Partial<CreateCouponDto>>;
export declare class UpdateCouponDto extends UpdateCouponDto_base {
    code: string;
    maxUsage: number;
    discountPorcent: number;
    discountValue?: number;
    validate?: Date;
    type: 'money' | 'percentage';
    range: 'category' | 'store' | 'first-buy';
    isLimited?: boolean;
    isPrivate?: boolean;
    categoriesIds?: string[];
}
export {};
