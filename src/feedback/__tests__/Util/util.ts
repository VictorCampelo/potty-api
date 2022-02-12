import { CreateFeedbackDto } from 'src/feedback/dto/create-feedback.dto';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';

export default class Util {
  static giveMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    return user;
  }

  static giveMeAValidStore(): Store {
    const store = new Store();
    store.id = '1';
    return store;
  }

  static giveMeAValidProduct(): Product {
    const product = new Product();
    product.id = '1';
    product.storeId = '1';
    return product;
  }

  static giveMeAValidOrder(): Order {
    const order = new Order();
    order.id = '1';
    order.orderHistorics = [this.giveMeAValidOrderHistoric()];
    return order;
  }

  static giveMeAValidOrderHistoric(): OrderHistoric {
    const orderHistoric = new OrderHistoric();
    orderHistoric.product = this.giveMeAValidProduct();
    orderHistoric.productId = this.giveMeAValidProduct().id;
    return orderHistoric;
  }

  static giveMeAValidCreateFeedbackDto(): CreateFeedbackDto {
    return { orderId: '1', productId: '1', star: 5, comment: 'Perfeito' };
  }
}
