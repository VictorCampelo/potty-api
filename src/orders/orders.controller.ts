import { StoresService } from 'src/stores/stores.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { findOrdersDto } from './dto/find-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storesService: StoresService,
  ) {}

  @Post('')
  @Role(UserRole.USER)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<{ orders: Order[]; whatsapp: string[]; message: string }> {
    try {
      const result = await this.ordersService.create(createOrderDto, user);
      return {
        orders: result.orders,
        whatsapp: result.messages,
        message: 'Order sucessfuly created',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('store/confirm/:id')
  @Role(UserRole.OWNER)
  async confirmOrder(@Param('id') orderId: string, @GetUser() user: User) {
    try {
      return await this.ordersService.confirmOrder(orderId, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('store')
  @Role(UserRole.OWNER)
  async findAll(
    @Query(ValidationPipe) query: findOrdersDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.ordersService.fillAllOrderByStatus(
        user.storeId,
        query.confirmed,
        query.limit,
        query.offset,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('store/:id')
  @Role(UserRole.OWNER)
  async findOneToStore(@Param('id') orderId: string, @GetUser() user: User) {
    try {
      return await this.ordersService.findOneToStore(orderId, user.storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch('update')
  @Role(UserRole.OWNER)
  async update(@Body(ValidationPipe) updateOrderDto: UpdateOrderDto) {
    try {
      return await this.ordersService.updateOrderSituation(updateOrderDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('user')
  @Role(UserRole.USER)
  async findAllOrdersByUser(
    @GetUser() user: User,
    @Query(ValidationPipe) query: FindMostSolds,
  ) {
    try {
      return await this.ordersService.findAllOrderByUser(
        user.id,
        query.confirmed,
        query.limit,
        query.offset,
      );
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('user/:id')
  @Role(UserRole.USER)
  async findOneToUser(@Param('id') id: string, @GetUser() user: User) {
    try {
      return await this.ordersService.findOneToUser(id, user.id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
