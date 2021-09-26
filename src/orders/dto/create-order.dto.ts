import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

interface Order {
  product: Product;
  amount: number;
}

export class CreateOrderDto {
  user: User;
  products: Order[];
}
