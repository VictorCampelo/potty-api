import { Product } from "src/products/product.entity";
export default class ProductUtils {
    static giveMeAValidProduct(id: string, storeId: string, price: number, inventory: number, title: string, discount?: number): Product;
}
