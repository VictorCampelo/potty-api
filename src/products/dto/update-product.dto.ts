import { IsOptional } from 'class-validator';

export class UpdateProductDto {
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];
}
