import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // store_id: string;

  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];
}
