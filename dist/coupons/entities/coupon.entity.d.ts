import { Store } from './../../stores/store.entity';
import { Order } from './../../orders/order.entity';
import { BaseEntity } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
export declare class Coupon extends BaseEntity {
    id: string;
    code: string;
    type: 'money' | 'percentage';
    range: 'category' | 'store' | 'first-buy';
    discountPorcent: number;
    discountValue: number;
    maxUsage: number;
    isExpired: boolean;
    isPrivate: boolean;
    isLimited: boolean;
    validate: Date;
    createdAt: Date;
    updatedAt: Date;
    categories: Category[];
    orders: Order[];
    store: Store;
    storeId: string;
    users: User[];
}
