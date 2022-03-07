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
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('dashboard')
@UseGuards(AuthGuard(), RolesGuard)
@Role(UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @ApiTags('dashboard')
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

  @ApiTags('dashboard')
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

  @ApiTags('dashboard')
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

  @ApiTags('dashboard')
  @Get('amountSoldProducts')
  @ApiQuery({ name: "start", type: "string", example: "2022-11-24 10:07:10", required: true })
  @ApiQuery({ name: "end", type: "string", example: "2022-11-27 12:07:10", required: true })
  @ApiQuery({ name: "limit", type: "string", example: 10, required: false })
  @ApiQuery({ name: "offset", type: "string", example: 0, required: false })
  // @ApiQuery({ name: "confirmed", type: "boolean", required: false })
  async findAmountSoldProducts(
    // @Param('id') storeId: string,
    @Query(ValidationPipe) query: FindMostSolds,
    @GetUser() user: User,
  ) {
    try {
      return await this.dashboardService.amountSold(user.storeId, query);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @ApiTags('dashboard')
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
