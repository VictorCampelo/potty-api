
import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

export class UniqueUpdateDto {
  product_id?: string;
  toBeDeleted?: Array<string>;

  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(']', '').replace('[', '').replaceAll('"', '').split(',')
      : value,
  )
  categoriesIds?: string[];

  @IsOptional()
  files?: Express.Multer.File[];

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @IsOptional()
  inventory: number;

  @Transform(({ value }) => parseInt(value))
  // @IsInt()
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
