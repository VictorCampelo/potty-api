export declare class CreateCouponDto {
    code: string;
    maxUsage: number;
    discountPorcent: number;
    discountValue?: number;
    validate?: Date;
    type: 'money' | 'percentage';
    range: 'category' | 'store' | 'first-buy';
    isLimited?: boolean;
    isPrivate?: boolean;
    categoriesIds: string[];
}
