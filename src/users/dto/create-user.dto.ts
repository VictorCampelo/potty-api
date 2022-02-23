import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'Informe o primeiro nome do usuário',
  })
  @MaxLength(200, {
    message: 'O primeiro nome deve ter menos de 200 caracteres',
  })
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'Informe o segundo nome do usuário',
  })
  @MaxLength(200, {
    message: 'O segundo nome deve ter menos de 200 caracteres',
  })
  lastName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: 'Informe a confirmação de senha',
  })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
  })
  passwordConfirmation: string;

  @IsOptional()
  zipcode?: string;

  @IsOptional()
  street?: string;

  @IsOptional()
  addressNumber?: number;

  @IsOptional()
  neighborhood?: string;

  @IsOptional()
  complement?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  uf?: string;

  @IsOptional()
  logradouro?: string;

  @IsOptional()
  googleId?: string;

  @IsOptional()
  facebookId?: string;

  @IsOptional()
  @Matches(/mensal|trimestral|anual/, {
    message: 'Invalid Plan ',
  })
  chosenPlan: string;
}
