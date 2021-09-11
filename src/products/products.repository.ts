import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { Store } from 'src/stores/store.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(
    createProductDto: CreateProductDto,
    store: Store,
  ): Promise<Product> {
    const { title, description, tags } = createProductDto;

    const product = this.create();
    product.store = store;
    // product.files = files;
    product.title = title;
    product.tags = tags;
    product.description = description;

    return product;
  }
}
