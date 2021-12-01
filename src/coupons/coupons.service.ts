import { CouponRepository } from './coupons.repository';
import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CouponsService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  async checkCoupom(code: string, storeId: string) {
    return this.couponRepository.findOne(code, {
      where: {
        store: storeId,
        isExpired: false,
        validate: LessThan(Date.now()),
      },
    });
  }

  findAll() {
    return `This action returns all coupons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
