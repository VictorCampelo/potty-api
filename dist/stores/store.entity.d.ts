import { Coupon } from './../coupons/entities/coupon.entity';
import { DispatchTypes, ScheduleProperties } from './types/scheduleProperties.interface';
import { BaseEntity } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { File as Files } from 'src/files/file.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Order } from 'src/orders/order.entity';
import { Payment } from 'src/payments/entities/payments.entity';
export declare class Store extends BaseEntity {
    id: string;
    name: string;
    formatedName: string;
    CNPJ: string;
    phone: string;
    street?: string;
    zipcode?: string;
    addressNumber?: number;
    neighborhood?: string;
    city: string;
    state: string;
    description?: string;
    enabled: boolean;
    sumOrders?: number;
    sumFeedbacks?: number;
    sumStars?: number;
    avgStars?: number;
    facebookLink: string;
    instagramLink: string;
    whatsappLink: string;
    schedules: ScheduleProperties;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
    avatar: Files;
    background: Files;
    files: Files[];
    categories: Category[];
    productCategories: Category[];
    owners: User[];
    coupons: Coupon[];
    usersWhoLiked: User[];
    likes: number;
    deliveryFee: number;
    dispatch: DispatchTypes;
    orders: Order[];
    paymentMethods: Payment[];
    setId(): void;
}
