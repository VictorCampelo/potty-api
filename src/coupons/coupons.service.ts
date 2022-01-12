import { CouponRepository } from './coupons.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Coupon } from './entities/coupon.entity';
import _ from 'lodash';

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

  async findAll(storeId: string) {
    return this.couponRepository.find({
      where: {
        storeId,
      },
    });
  }

  async findOne(code: string) {
    return this.couponRepository.findOne({
      where: {
        code,
      },
      relations: ['categories'],
    });
  }

  async findLocal(code: string, storeId: string) {
    return this.couponRepository.findOne({
      where: {
        code,
        storeId,
      },
      // relations: ['categories'],
    });
  }

  async decreaseUsedCoupon(coupon: Coupon) {
    coupon.maxUsage -= 1;
    return this.couponRepository.save(coupon);
  }

  async update(updateCouponDto: UpdateCouponDto, storeId: string, couponCode) {
    const coupon = await this.findLocal(couponCode, storeId);

    if (!coupon) {
      throw new HttpException(
        "The Coupon you're trying to update doesn't belong to your Store",
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateCouponDto.categoriesIds) {
      coupon.categories = await this.categoriesService.findAllByIds(
        updateCouponDto.categoriesIds,
      );

      updateCouponDto = _.omit(updateCouponDto, 'categoriesIds');
      await coupon.save();
    }

    return this.couponRepository.update(coupon.id, updateCouponDto);
  }

  async remove(couponCode: string, storeId: string) {
    const coupon = await this.findLocal(couponCode, storeId);

    if (!coupon) {
      throw new HttpException(
        "The Coupon you're trying to update doesn't belong to your Store",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.couponRepository.delete(coupon.id);
  }
}
