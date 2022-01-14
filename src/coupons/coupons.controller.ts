import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Role(UserRole.OWNER)
  async create(
    @Body() createCouponDto: CreateCouponDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.couponsService.create(createCouponDto, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get()
  @Role(UserRole.OWNER)
  async find(@GetUser() user: User) {
    try {
      return await this.couponsService.findAll(user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get(':code')
  @Role(UserRole.OWNER)
  async findCoupon(@Param('code') couponCode: string, @GetUser() user: User) {
    try {
      return await this.couponsService.findLocal(couponCode, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch(':code')
  @Role(UserRole.OWNER)
  async updateCoupon(
    @Param('code') couponCode: string,
    @Body(ValidationPipe) updateCouponDto: UpdateCouponDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.couponsService.update(
        updateCouponDto,
        user.storeId,
        couponCode,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete(':code')
  @Role(UserRole.OWNER)
  async deleteCoupon(@Param('code') code: string, @GetUser() user: User) {
    try {
      return await this.couponsService.remove(code, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
