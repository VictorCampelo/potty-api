import { StoresService } from 'src/stores/stores.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { UserRole } from 'src/users/user-roles.enum';
import { Role } from 'src/auth/role.decorator';
import { FindMostSolds } from 'src/dashboard/dto/find-most-solds.dto';
import { ErrorHandling } from 'src/configs/error-handling';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storesService: StoresService,
  ) {}

  @Post(':id')
  @Role(UserRole.USER)
  async create(
    @Param('id') storeId: string,
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<{ orders: Order[]; whatsapp: string; message: string }> {
    try {
      const store = await this.storesService.findOne(storeId);

      const result = await this.ordersService.create(
        createOrderDto,
        user,
        store,
      );
      return {
        orders: result.ordersResult,
        whatsapp: result.msg,
        message: 'Order sucessfuly created',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('store/:storeId/confirm/:hashId')
  @Role(UserRole.OWNER)
  async confirmOrder(
    @Param('hashId') hashId: string,
    @Param('storeId') storeId: string,
  ) {
    try {
      return await this.ordersService.confirmOrder(hashId, storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('store/:storeId')
  @Role(UserRole.OWNER)
  async findAll(
    @Param('storeId') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.ordersService.fillAllOrderByStatus(
        storeId,
        query.confirmed,
        query.limit,
        query.offset,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('user/hash/:hashId')
  @Role(UserRole.USER)
  async findOneToUser(
    @Param('hashId') hashId: string,
    @GetUser() user: User,
  ): Promise<Order[]> {
    try {
      return await this.ordersService.findOneToUser(hashId, user.id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('store/:storeId/hash/:hashId/')
  @Role(UserRole.OWNER)
  async findOneToStore(
    @Param('hashId') hashId: string,
    @Param('storeId') storeId: string,
  ): Promise<Order[]> {
    try {
      return await this.ordersService.findOneToStore(hashId, storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('user/')
  @Role(UserRole.USER)
  async findAllOrdersByUser(
    @GetUser() user: User,
    @Body(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.ordersService.findAllOrderByUser(
        user.id,
        query.limit,
        query.offset,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
