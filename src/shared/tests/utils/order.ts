import { Order } from 'src/orders/order.entity';
import OrderHistoricsUtil from './orderHistorics';

export default class OrderUtils {
  static giveMeAValidCreatedOrder(id: string): Order {
    const order = new Order();
    order.id = id;
    return order;
  }

  static giveMeAValidOrder(id = '1', historicsId = '1'): Order {
    const order = new Order();
    order.id = id;
    order.orderHistorics = [
      OrderHistoricsUtil.giveMeAValidOrderHistoric(historicsId),
    ];
    return order;
  }
}
