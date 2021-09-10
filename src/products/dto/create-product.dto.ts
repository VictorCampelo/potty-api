import { IsOptional } from 'class-validator';
import { Store } from 'src/stores/store.entity';

export class CreateProductDto {
  store: Store;

  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];
}
