import { Coupon } from './entities/coupon.entity';
import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CouponRepository } from './coupons.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
