import { OrderHistoric } from './../order-historics/entities/order-historic.entity';
import { Coupon } from './../coupons/entities/coupon.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Order extends BaseEntity {
    id: string;
    user: User;
    orderNumber: string;
    userId: string;
    coupon: Coupon;
    couponId: string;
    orderHistorics: OrderHistoric[];
    store: Store;
    storeId: string;
    amount: number;
    status: boolean;
    situation: 'Recebido' | 'Processando' | 'Concluído' | 'Cancelado';
    requiresDelivery?: boolean;
    customerAddress?: string;
    createdAt: Date;
    updatedAt: Date;
    generateOrderNumber(): void;
}
