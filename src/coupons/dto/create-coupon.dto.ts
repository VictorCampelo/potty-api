export class CreateCouponDto {
  code: string;
  maxUsage: number;
  validate?: Date;
  storeId: string;
}
