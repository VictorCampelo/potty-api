import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';

export class CreateUserStore {
  storeDto: CreateStoreDto;
  userDto: CreateUserDto;
}
