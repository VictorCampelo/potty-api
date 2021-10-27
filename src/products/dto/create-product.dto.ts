import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateProductDto {
  title: string;

  price: number;

  description?: string;

  tags?: string[];

  @IsInt()
  @Min(0)
  inventory: number;

  files?: Express.Multer.File[];

  categoriesIds?: string[];

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;
}
