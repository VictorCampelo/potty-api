import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import ProductUtils from './product';

export default class OrderHistoricsUtil {
  static giveMeAValidOrderHistoric(id = '1'): OrderHistoric {
    const orderHistoric = new OrderHistoric();
    orderHistoric.product = ProductUtils.giveMeAValidProduct(
      id,
      '1',
      10,
      10,
      'produto teste',
    );
    orderHistoric.productId = ProductUtils.giveMeAValidProduct(
      id,
      '1',
      10,
      10,
      'produto teste',
    ).id;

    return orderHistoric;
  }
}
