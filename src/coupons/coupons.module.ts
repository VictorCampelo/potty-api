import { Coupon } from './entities/coupon.entity';
import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
