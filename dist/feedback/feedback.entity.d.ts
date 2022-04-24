import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Feedback extends BaseEntity {
    id: string;
    orderId: string;
    star: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    user: User;
    product: Product;
}
