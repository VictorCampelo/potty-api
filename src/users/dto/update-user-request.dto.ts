import { IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from './update-users.dto';
export class UpdateUserRequestDto {
  updateUserDto: UpdateUserDto;

  @IsString({
    message: 'Informe o ID de usuário válido',
  })
  id: string;
  @IsOptional()
  file: Express.Multer.File;
}
