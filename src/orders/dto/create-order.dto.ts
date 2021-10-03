import { Product } from 'src/products/product.entity';

interface Order {
  product: Product;
  amount: number;
}

export class CreateOrderDto {
  products: Order[];
}
