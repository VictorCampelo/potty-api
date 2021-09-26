import { Product } from 'src/products/product.entity';
export class CreateFeedbackDto {
  start: number;
  comment: string;
  product: Product;
}
