import { FindMostSolds } from './dto/find-most-solds.dto';
import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { DashboardService } from './dashboard.service';
import { ErrorHandling } from 'src/configs/error-handling';

@Controller('dashboard')
@UseGuards(AuthGuard(), RolesGuard)
@Role(UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('mostSolds/:id')
  async findMostSoldsProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.dashboardService.mostSolds(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('lastSolds/:id')
  async findLastSoldsProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.dashboardService.lastSolds(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('lastFeedbacks/:id')
  async findFeedbacks(@Param('id') storeId: string) {
    try {
      return await this.dashboardService.lastFeedbacks(storeId);
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
      return await this.dashboardService.amountSoldProducts(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('income/:id')
  async findIncome(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.dashboardService.income(storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
