import { CouponRepository } from './coupons.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Coupon } from './entities/coupon.entity';
export declare class CouponsService {
    private readonly couponRepository;
    private readonly categoriesService;
    constructor(couponRepository: CouponRepository, categoriesService: CategoriesService);
    create(createCouponDto: CreateCouponDto, storeId: string): Promise<Coupon>;
    checkCoupom(code: string, storeId: string): Promise<Coupon>;
    findAll(storeId: string): Promise<Coupon[]>;
    findOne(code: string): Promise<Coupon>;
    findLocal(code: string, storeId: string): Promise<Coupon>;
    decreaseUsedCoupon(coupon: Coupon): Promise<Coupon>;
    update(updateCouponDto: UpdateCouponDto, storeId: string, couponCode: any): Promise<import("typeorm").UpdateResult>;
    remove(couponCode: string, storeId: string): Promise<import("typeorm").DeleteResult>;
}
