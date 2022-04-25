import { User } from 'src/users/user.entity';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createCouponDto: CreateCouponDto, user: User): Promise<import("./entities/coupon.entity").Coupon>;
    find(user: User): Promise<import("./entities/coupon.entity").Coupon[]>;
    findCoupon(couponCode: string, user: User): Promise<import("./entities/coupon.entity").Coupon>;
    updateCoupon(couponCode: string, updateCouponDto: UpdateCouponDto, user: User): Promise<import("typeorm").UpdateResult>;
    deleteCoupon(code: string, user: User): Promise<import("typeorm").DeleteResult>;
}
