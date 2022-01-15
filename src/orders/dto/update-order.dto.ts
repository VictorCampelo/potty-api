import { PartialType } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  orderId: string;

  @Matches(/Recebido|Processando|Concluído|Cancelado/, {
    message: 'Invalid Order situation',
  })
  situation: 'Recebido' | 'Processando' | 'Concluído' | 'Cancelado';
}
