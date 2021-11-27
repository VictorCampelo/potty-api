import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderHistoricsService } from './order-historics.service';
import { CreateOrderHistoricDto } from './dto/create-order-historic.dto';
import { UpdateOrderHistoricDto } from './dto/update-order-historic.dto';

@Controller('order-historics')
export class OrderHistoricsController {
  constructor(private readonly orderHistoricsService: OrderHistoricsService) {}

  @Post()
  create(@Body() createOrderHistoricDto: CreateOrderHistoricDto) {
    return this.orderHistoricsService.create(createOrderHistoricDto);
  }

  @Get()
  findAll() {
    return this.orderHistoricsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderHistoricsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderHistoricDto: UpdateOrderHistoricDto) {
    return this.orderHistoricsService.update(+id, updateOrderHistoricDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderHistoricsService.remove(+id);
  }
}
