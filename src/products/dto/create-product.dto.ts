import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// All values from a application/x-www-form-urlencoded request are always strings.
export class CreateProductDto {
  title: string;

  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  @Min(0)
  price: number;

  description?: string;

  tags?: string[];

  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  @Min(0)
  inventory: number;

  files?: Express.Multer.File[];

  categoriesIds?: string[];

  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
  @IsOptional()
  @IsInt()
  @Min(1)
  parcelAmount?: number;
}
