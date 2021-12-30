import { IsOptional, Matches, Max, Min } from 'class-validator';

export class CreateCouponDto {
  code: string;
  maxUsage: number;

  @Min(0)
  @Max(100)
  discountPorcent: number;

  @IsOptional()
  @Min(0)
  discountValue?: number;

  validate?: Date;

  @Matches(/money|percentage/, { message: 'Invalid coupom type' })
  type: 'money' | 'percentage';

  @Matches(/category|store|first-buy/, { message: 'Invalid coupom range' })
  range: 'category' | 'store' | 'first-buy';

  @IsOptional()
  isLimited?: boolean;

  @IsOptional()
  isPrivate?: boolean;

  @IsOptional()
  categoriesIds: string[];
}
