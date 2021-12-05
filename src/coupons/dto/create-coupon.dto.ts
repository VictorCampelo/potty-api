export class CreateCouponDto {
  code: string;
  maxUsage: number;
  discountPorcent: number;
  validate?: Date;
}
