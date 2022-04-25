import { Feedback } from '../feedback/feedback.entity';
import { Store } from 'src/stores/store.entity';
import { BaseEntity } from 'typeorm';
import { File } from 'src/files/file.entity';
import { Category } from 'src/categories/category.entity';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
export declare class Product extends BaseEntity {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    price: number;
    priceWithDiscount: number;
    discount: number;
    sumOrders?: number;
    sumFeedbacks?: number;
    sumStars?: number;
    avgStars?: number;
    inventory: number;
    lastSold?: Date;
    parcelAmount?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    store: Store;
    storeId: string;
    files: File[];
    categories: Category[];
    feedbacks: Feedback[];
    orderHistorics: OrderHistoric[];
    calculateDiscount(): void;
}
