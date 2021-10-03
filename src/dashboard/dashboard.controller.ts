import { FindMostSolds } from './dto/find-most-solds.dto';
import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard(), RolesGuard)
@Role(UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('mostSolds/:id')
  findMostSoldsProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    return this.dashboardService.mostSolds(storeId, query);
  }

  @Get('lastSolds/:id')
  findLastSoldsProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    return this.dashboardService.lastSolds(storeId, query);
  }

  @Get('lastFeedbacks/:id')
  findFeedbacks(@Param('id') storeId: string) {
    return this.dashboardService.lastFeedbacks(storeId);
  }

  @Get('amountSoldProducts/:id')
  findAmountSoldProducts(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    return this.dashboardService.amountSoldProducts(storeId, query);
  }

  @Get('income/:id')
  findIncome(
    @Param('id') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    return this.dashboardService.income(storeId, query);
  }
}
