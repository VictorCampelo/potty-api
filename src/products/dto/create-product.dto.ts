import { Max, Min } from 'class-validator';

export class CreateProductDto {
  title: string;

  @Min(0)
  price: number;

  description?: string;

  tags?: string[];

  @Min(0)
  inventory: number;

  files?: Express.Multer.File[];

  categoriesIds?: string[];

  @Min(0)
  @Max(100)
  discount?: number;
}
