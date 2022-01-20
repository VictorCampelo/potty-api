import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// All values from a application/x-www-form-urlencoded request are always strings.
export class CreateProductDto {
  title: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  price: number;

  description?: string;

  tags?: string[];

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  inventory: number;

  files?: Express.Multer.File[];

  @IsOptional()
  categoriesIds?: string[];

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  parcelAmount?: number;
}
