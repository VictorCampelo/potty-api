import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Controller('dashboard')
@UseGuards(AuthGuard(), RolesGuard)
@Role(UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('mostSolds')
  findMostSoldsProducts(@GetUser() user: User) {
    return this.dashboardService.mostSolds();
  }
  @Get('lastSolds')
  findLastSoldsProducts(@GetUser() user: User) {
    return this.dashboardService.lastSolds(user.store.id);
  }
  @Get('lastFeedbacks')
  findFeedbacks(@GetUser() user: User) {
    return this.dashboardService.lastFeedbacks();
  }
  @Get('amountSoldProducts')
  findAmountSoldProducts(@GetUser() user: User) {
    return this.dashboardService.amountSoldProducts();
  }
  @Get('income')
  findIncome(@GetUser() user: User) {
    return this.dashboardService.income();
  }
}
