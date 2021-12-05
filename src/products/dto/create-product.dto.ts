<<<<<<< HEAD
import { IsInt, Max, Min } from 'class-validator';
=======
import { IsInt, IsOptional, Max, Min } from 'class-validator';
>>>>>>> origin/BDV-116
import { Transform } from 'class-transformer';

// All values from a application/x-www-form-urlencoded request are always strings.
export class CreateProductDto {
  title: string;

<<<<<<< HEAD
  @Transform(value => Number.isNaN(+value) ? 0 : +value)
=======
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
>>>>>>> origin/BDV-116
  @IsInt()
  @Min(0)
  price: number;

  description?: string;

  tags?: string[];

<<<<<<< HEAD
  @Transform(value => Number.isNaN(+value) ? 0 : +value)
=======
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
>>>>>>> origin/BDV-116
  @IsInt()
  @Min(0)
  inventory: number;

  files?: Express.Multer.File[];

  categoriesIds?: string[];

<<<<<<< HEAD
  @Transform(value => Number.isNaN(+value) ? 0 : +value)
=======
  @Transform((value) => (Number.isNaN(+value) ? 0 : +value))
>>>>>>> origin/BDV-116
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;
}
