import { IsOptional } from 'class-validator';
import { Store } from 'src/stores/store.entity';

interface ProductField {
  title: string;

  description?: string;

  tags?: string[];
}
export class CreateProductDto {
  store: Store;

  productFields: ProductField;

  files?: Express.Multer.File[];
}
