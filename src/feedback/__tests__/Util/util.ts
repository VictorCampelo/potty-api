import { CreateFeedbackDto } from 'src/feedback/dto/create-feedback.dto';
import { Feedback } from 'src/feedback/feedback.entity';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';

export default class Util {
  static giveMeAValidUser(id = '1'): User {
    const user = new User();
    user.id = id;
    return user;
  }

  static giveMeAValidStore(id = '1'): Store {
    const store = new Store();
    store.id = id;
    return store;
  }

  static giveMeAValidProduct(id = '1'): Product {
    const product = new Product();
    product.id = id;
    product.storeId = id;
    return product;
  }

  static giveMeAValidOrder(id = '1', historicsId = '1'): Order {
    const order = new Order();
    order.id = id;
    order.orderHistorics = [this.giveMeAValidOrderHistoric(historicsId)];
    return order;
  }

  static giveMeAValidOrderHistoric(id = '1'): OrderHistoric {
    const orderHistoric = new OrderHistoric();
    orderHistoric.product = this.giveMeAValidProduct(id);
    orderHistoric.productId = this.giveMeAValidProduct(id).id;
    return orderHistoric;
  }

  static giveMeAValidCreateFeedbackDto(
    orderId = '1',
    productId = '1',
    star = 5,
    comment = 'Interessante',
  ): CreateFeedbackDto {
    return { orderId, productId, star, comment };
  }

  static giveMeAValidFeedback(id = '1'): Feedback {
    const feedback = new Feedback();
    feedback.id = id;
    return feedback;
  }
}
