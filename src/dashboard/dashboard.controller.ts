import { FindMostSolds } from './dto/find-most-solds.dto';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
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
  @Get('mostSolds')
  findMostSoldsProducts(@Query() query: FindMostSolds, @GetUser() user: User) {
    return this.dashboardService.mostSolds(user.store.id, query);
  }
  @Get('lastSolds')
  findLastSoldsProducts(@GetUser() user: User) {
    return this.dashboardService.lastSolds(user.store.id);
  }
  @Get('lastFeedbacks')
  findFeedbacks(@GetUser() user: User) {
    return this.dashboardService.lastFeedbacks(user.store.id);
  }
  @Get('amountSoldProducts')
  findAmountSoldProducts(@Query() query: FindMostSolds, @GetUser() user: User) {
    return this.dashboardService.amountSoldProducts(user.store.id, query);
  }
  @Get('income')
  findIncome(@Query() query: FindMostSolds, @GetUser() user: User) {
    return this.dashboardService.income(user.store.id, query);
  }
}
