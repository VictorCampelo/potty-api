import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { store, title, description, tags } = createProductDto;

    const product = this.create();
    product.store = store;
    product.title = title;
    product.tags = tags;
    product.description = description;

    return product;
  }
}
