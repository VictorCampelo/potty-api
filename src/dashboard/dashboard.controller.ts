import { User } from 'src/users/user.entity';
import { FindMostSolds } from './dto/find-most-solds.dto';
import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { DashboardService } from './dashboard.service';
import { ErrorHandling } from 'src/configs/error-handling';
import { ProductsService } from 'src/products/products.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('dashboard')
@UseGuards(AuthGuard(), RolesGuard)
@Role(UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('mostSolds')
  async findMostSoldsProducts(
    @Query(ValidationPipe) query: FindMostSolds,
    @GetUser() user: User,
  ) {
    try {
      return await this.dashboardService.mostSolds(user.storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('lastSolds')
  async findLastSoldsProducts(
    @Query(ValidationPipe) query: FindMostSolds,
    @GetUser() user: User,
  ) {
    try {
      return await this.dashboardService.lastSolds(user.storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('lastFeedbacks')
  async findFeedbacks(
    @Query(ValidationPipe) query: FindMostSolds,
    @GetUser() user: User,
  ) {
    try {
      return await this.dashboardService.lastFeedbacks(user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('amountSoldProducts/:id')
  async findAmountSoldProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.dashboardService.amountSold(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('income')
  async findIncome(
    @Query(ValidationPipe) query: FindMostSolds,
    @GetUser() user: User,
  ) {
    try {
      return await this.dashboardService.income(user.storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
