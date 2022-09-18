import { PartialType } from '@nestjs/swagger';
import { CreateOrderHistoricDto } from './create-order-historic.dto';

export class UpdateOrderHistoricDto extends PartialType(
  CreateOrderHistoricDto,
) {}
