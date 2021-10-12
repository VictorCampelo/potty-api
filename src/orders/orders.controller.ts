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
  ): Promise<{ orders: Order[]; message: string }> {
    const store = await this.storesService.findOne(storeId);

    const orders = await this.ordersService.create(createOrderDto, user, store);
    return { orders: orders, message: 'Order sucessfuly created' };
  }

  @Post('confirm/:id')
  @Role(UserRole.OWNER)
  async confirmOrder(
    @Param('orderId') orderId: string,
  ): Promise<{ orders: Order; message: string }> {
    const orders = await this.ordersService.confirmOrder(orderId);
    return { orders: orders, message: 'Order sucessfuly confirmed' };
  }

  @Get('pending/:storeId')
  @Role(UserRole.OWNER)
  async findAll(
    @Param('storeId') storeId: string,
    @Body(ValidationPipe) query: FindMostSolds,
  ): Promise<Order[]> {
    const order = await this.ordersService.findAllPending(
      storeId,
      query.limit,
      query.offset,
    );

    return order;
  }

  @Get(':orderId')
  @Role(UserRole.OWNER)
  async findOne(@Param('orderId') orderId: string): Promise<Order> {
    const order = await this.ordersService.findOne(orderId);
    return order;
  }

  @Get('user/')
  @Role(UserRole.USER)
  async findAllOrdersByUser(
    @GetUser() user: User,
    @Body(ValidationPipe) query: FindMostSolds,
  ): Promise<Order[]> {
    const order = await this.ordersService.findAllOrderByUser(
      user.id,
      query.limit,
      query.offset,
    );
    return order;
  }
}
