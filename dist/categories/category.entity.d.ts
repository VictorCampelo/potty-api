import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';
export declare class Category {
    id: string;
    name: string;
    enabled: boolean;
    type: string;
    store: Store[];
    storeProducts: Store;
    storeProductsId: string;
    products: Product[];
    coupon: Coupon;
    createdAt: Date;
    updatedAt: Date;
}
