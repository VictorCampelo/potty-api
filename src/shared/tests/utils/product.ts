import { Product } from 'src/products/product.entity';
import CategoryUtils from './category';

export default class ProductUtils {
  static giveMeAValidProduct(
    id: string,
    storeId: string,
    price: number,
    inventory: number,
    title: string,
    discount?: number,
  ): Product {
    const product = new Product();
    product.id = id;
    product.storeId = storeId;
    product.price = price;
    product.inventory = inventory;
    product.title = title;
    product.discount = discount;
    product.categories = [
      CategoryUtils.giveMeAValidCategory('1', 'Calçados'),
      CategoryUtils.giveMeAValidCategory('2', 'Bebidas'),
    ];
    return product;
  }
}
