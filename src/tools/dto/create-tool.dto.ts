import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UniqueOnDatabase } from 'src/validation/UniqueValidation';
import { Tool } from '../tool.entity';

export class CreateToolDto {
  @IsNotEmpty()
  @UniqueOnDatabase(Tool)
  title: string;

  @MaxLength(200)
  description: string;

  @MaxLength(200, {
    each: true,
    message:
      'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  tags: string[];
}
