import { Product } from 'src/products/product.entity';

export default class Util {
  static giveMeAValidProduct(id: string, storeId: string): Product {
    const product = new Product();
    product.id = id;
    product.storeId = storeId;
    return product;
  }
}
