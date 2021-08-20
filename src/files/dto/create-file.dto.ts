import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UniqueOnDatabase } from 'src/validation/UniqueValidation';
import { File } from '../file.entity';

export class CreateFileDto {
  file: Express.Multer.File;
  tags: string[];

  @IsNotEmpty()
  @UniqueOnDatabase(File)
  url: string;

  @IsNotEmpty()
  @UniqueOnDatabase(File)
  @MaxLength(200)
  name: string;
}
