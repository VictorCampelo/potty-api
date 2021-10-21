import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStore {
  @ApiProperty()
  storeDto: CreateStoreDto;
  @ApiProperty()
  userDto: CreateUserDto;
}
