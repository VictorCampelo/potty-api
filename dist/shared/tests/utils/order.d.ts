import { Order } from 'src/orders/order.entity';
export default class OrderUtils {
    static giveMeAValidCreatedOrder(id: string): Order;
    static giveMeAValidOrder(id?: string, historicsId?: string): Order;
}
