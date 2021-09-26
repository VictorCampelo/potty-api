import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';

interface LoadProducts {
  limit: number;
  offset: number;
}

export class FindStoreDto {
  store_id: string;
  loadProducts?: LoadProducts;
}
