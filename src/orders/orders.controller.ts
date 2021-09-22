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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Order } from './order.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<{ orders: Order[]; message: string }> {
    createOrderDto.user = user;

    const orders = await this.ordersService.create(createOrderDto);
    orders.map(async (currentOrder) => {
      await currentOrder.save();
    });
    /*
     ! Não está retornando o ID da ordem, pois acabou de ser registrada no DB
     ! Sendo assim, apenas no próximo pedido do mesmo usuário, irá retornar
     */
    return { orders: orders, message: 'Order sucessfuly created' };
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
