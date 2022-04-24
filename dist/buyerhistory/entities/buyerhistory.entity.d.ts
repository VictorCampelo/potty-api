import { User } from 'src/users/user.entity';
import { BaseEntity } from 'typeorm';
export declare class BuyerHistory extends BaseEntity {
    id: string;
    user: User;
    accountStatus: string;
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}
