import { PartialType } from '@nestjs/swagger';
import { IsOptional, Matches, Max, Min } from 'class-validator';
import { CreateCouponDto } from './create-coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @IsOptional()
  code: string;

  @IsOptional()
  maxUsage: number;

  @Min(0)
  @Max(100)
  @IsOptional()
  discountPorcent: number;

  @IsOptional()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  validate?: Date;

  @Matches(/money|percentage/, { message: 'Invalid coupom type' })
  @IsOptional()
  type: 'money' | 'percentage';

  @Matches(/category|store|first-buy/, { message: 'Invalid coupom range' })
  @IsOptional()
  range: 'category' | 'store' | 'first-buy';

  @IsOptional()
  isLimited?: boolean;

  @IsOptional()
  isPrivate?: boolean;

  @IsOptional()
  categoriesIds?: string[];
}
