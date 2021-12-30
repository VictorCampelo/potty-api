import { CouponRepository } from './coupons.repository';
import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly categoriesService: CategoriesService,
  ) {}
  async create(createCouponDto: CreateCouponDto, storeId: string) {
    const coupon = this.couponRepository.create();
    createCouponDto['storeId'] = storeId;

    coupon.code = createCouponDto.code;
    coupon.maxUsage = createCouponDto.maxUsage;
    coupon.type = createCouponDto.type;
    coupon.discountPorcent =
      createCouponDto.discountPorcent && createCouponDto.discountPorcent / 100;
    coupon.discountValue = createCouponDto.discountValue;
    coupon.validate = createCouponDto.validate;
    coupon.range = createCouponDto.range;
    coupon.isLimited = createCouponDto.isLimited;
    coupon.isPrivate = createCouponDto.isPrivate;
    coupon.storeId = storeId;

    if (createCouponDto.categoriesIds) {
      coupon.categories = await this.categoriesService.findAllByIds(
        createCouponDto.categoriesIds,
      );
    }

    return this.couponRepository.save(coupon);
  }

  async checkCoupom(code: string, storeId: string) {
    return this.couponRepository.findOne({
      where: {
        code,
        storeId,
        isExpired: false,
      },
    });
  }

  findAll() {
    return `This action returns all coupons`;
  }

  async findOne(code: string) {
    return this.couponRepository.findOne({
      where: {
        code,
      },
      relations: ['categories'],
    });
  }

  async decreaseUsedCoupon(coupon: Coupon) {
    coupon.maxUsage -= 1;
    return this.couponRepository.save(coupon);
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
