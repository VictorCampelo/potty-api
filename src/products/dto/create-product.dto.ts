import { IsOptional } from 'class-validator';

export class CreateProductDto {
  store_id: string;

  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];
}
