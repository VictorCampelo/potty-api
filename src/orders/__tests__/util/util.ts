import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/order.entity';

export default class Util {
  static giveMeAValidCreateOrderPayload(): CreateOrderDto {
    const payload: CreateOrderDto = {
      products: [
        {
          storeId: '1',
          orderProducts: [
            {
              productId: '2',
              amount: 3,
            },
          ],
        },
      ],
    };

    return payload;
  }

  static giveMeAValidStore(id: string, phone: string): Store {
    const store = new Store();
    store.id = id;
    store.phone = phone;
    return store;
  }

  static giveMeAValidUser(): User {
    const user = new User();
    user.id = '123';
    user.firstName = 'Rodrigo';
    user.lastName = 'Brito';
    user.neighborhood = 'Ininga';
    user.street = 'Rua Jornalista Helder Feitosa';
    user.addressNumber = 1131;
    user.city = 'Teresina';
    user.uf = 'PI';
    user.zipcode = '64049-905';

    return user;
  }

  static giveMeAValidProduct(
    id: string,
    storeId: string,
    price: number,
    inventory: number,
    title: string,
    discount?: number,
  ): Product {
    const product = new Product();
    product.id = id;
    product.storeId = storeId;
    product.price = price;
    product.inventory = inventory;
    product.title = title;
    product.discount = discount;
    return product;
  }

  static giveMeAValidCreatedOrder(id: string): Order {
    const order = new Order();
    order.id = id;
    return order;
  }
}
