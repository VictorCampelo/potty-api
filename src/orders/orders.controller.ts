import { StoresService } from 'src/stores/stores.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { UserRole } from 'src/users/user-roles.enum';
import { Role } from 'src/auth/role.decorator';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  @Role(UserRole.USER)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<{ orders: Order[]; message: string }> {
    const store = await this.storesService.findOne(user.storeId);

    const orders = await this.ordersService.create(createOrderDto, user, store);
    return { orders: orders, message: 'Order sucessfuly created' };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    const order = await this.ordersService.findOne(id);

    return order;
  }
}
