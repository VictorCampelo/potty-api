import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  inventory: number;

  categoriesIds?: string[];
}
