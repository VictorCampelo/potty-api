import { UserRole } from '../user-roles.enum';
import { IsString, IsEmail, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  firstName: string;

  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  lastName: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;

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
}
