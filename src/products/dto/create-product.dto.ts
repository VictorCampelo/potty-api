import { IsOptional } from 'class-validator';
import { File } from 'src/files/file.entity';

export class CreateProductDto {
  store_id: string;

  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];

  files: File[];
}
