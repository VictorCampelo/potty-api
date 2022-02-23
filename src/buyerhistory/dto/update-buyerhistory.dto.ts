import { PartialType } from '@nestjs/swagger';
import { CreateBuyerhistoryDto } from './create-buyerhistory.dto';

export class UpdateBuyerhistoryDto extends PartialType(CreateBuyerhistoryDto) {}
