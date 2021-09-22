import { User } from 'src/users/user.entity';

interface Order {
  product_id: string;
  amount: number;
}

export class CreateOrderDto {
  user: User;
  orders: Order[];
}
