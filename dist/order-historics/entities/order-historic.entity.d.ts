import { Product } from 'src/products/product.entity';
import { BaseEntity } from 'typeorm';
import { Order } from 'src/orders/order.entity';
export declare class OrderHistoric extends BaseEntity {
    id: string;
    storeId: string;
    productQtd: number;
    paymentMethod: string;
    productPrice: number;
    productParcels: number;
    customerId: string;
    order: Order;
    orderId: string;
    product: Product;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}
