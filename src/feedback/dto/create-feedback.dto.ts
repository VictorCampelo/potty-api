import { Product } from 'src/products/product.entity';
export class CreateFeedbackDto {
  comment: string;
  product: Product;
}
