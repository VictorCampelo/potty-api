import { Coupon } from './entities/coupon.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Coupon)
export class CouponRepository extends Repository<Coupon> {}
