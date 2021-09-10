import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UniqueOnDatabase } from 'src/validation/UniqueValidation';
import { File } from '../file.entity';

export class CreateFileDto {
  tags: string[];

  name: string;
}
