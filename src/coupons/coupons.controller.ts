import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Role(UserRole.OWNER)
  async create(@Body() createCouponDto: CreateCouponDto, @GetUser() user: User) {
    try {
      return await this.couponsService.create(createCouponDto, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
