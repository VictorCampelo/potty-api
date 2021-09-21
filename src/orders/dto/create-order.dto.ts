import { User } from 'src/users/user.entity';

export class CreateOrderDto {
  user: User;
  product_id: string;
}
