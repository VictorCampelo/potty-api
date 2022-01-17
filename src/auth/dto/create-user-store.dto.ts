import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateUserStore {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  storeDto: CreateStoreDto;
  @ApiProperty()
  userDto: CreateUserDto;
}
