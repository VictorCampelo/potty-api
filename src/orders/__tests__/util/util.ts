import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/order.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Category } from 'src/categories/category.entity';
import { Payment } from 'src/payments/entities/payments.entity';

export enum CouponRange {
  category = 'category',
  store = 'store',
  first_buy = 'first-buy',
}

export enum CouponDiscountType {
  money = 'money',
  percentage = 'percentage',
}
export default class Util {
  static giveMeAValidCreateOrderWithDiscountPayload(
    coupon?: string,
  ): CreateOrderDto {
    const payload: CreateOrderDto = {
      products: [
        {
          storeId: '1',
          orderProducts: [
            {
              productId: '3',
              amount: 3,
              paymentMethod: 'boleto',
            },
          ],
        },
        {
          storeId: '2',
          orderProducts: [
            {
              productId: '4',
              amount: 2,
              paymentMethod: 'pix',
            },
          ],
        },
      ],
      couponCode: coupon,
    };

    return payload;
  }

  static giveMeAValidCreateOrderPayload(coupon?: string): CreateOrderDto {
    const payload: CreateOrderDto = {
      products: [
        {
          storeId: '1',
          orderProducts: [
            {
              productId: '2',
              amount: 3,
              paymentMethod: 'visa',
            },
          ],
        },
      ],
      couponCode: coupon,
    };

    return payload;
  }

  static giveMeAValidStore(
    id: string,
    phone: string,
    paymentMethods?: string[],
    name = 'minha loja',
  ): Store {
    const store = new Store();
    store.name = name;
    store.id = id;
    store.phone = phone;
    if (paymentMethods) {
      paymentMethods.forEach((p) => {
        if (store.paymentMethods) {
          store.paymentMethods.push(this.giveMeAValidPaymentMethod(p));
        } else {
          store.paymentMethods = [this.giveMeAValidPaymentMethod(p)];
        }
      });
    }
    // store.paymentMethods = [this.giveMeAValidPaymentMethod()];
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
    product.categories = [
      this.giveMeAValidCategory('1', 'Calçados'),
      this.giveMeAValidCategory('2', 'Bebidas'),
    ];
    return product;
  }

  static giveMeAValidCreatedOrder(id: string): Order {
    const order = new Order();
    order.id = id;
    return order;
  }

  static giveMeAValidCoupon(
    code = 'cupom',
    isExpired = false,
    maxUsage = 100,
    storeId = '1',
    range = CouponRange.category,
    categoriesIds = ['1'],
    type = CouponDiscountType.money,
    discount = 5,
  ): Coupon {
    const coupon = new Coupon();
    coupon.code = code;
    coupon.isExpired = isExpired;
    coupon.maxUsage = maxUsage;
    coupon.storeId = storeId;
    coupon.range = range;
    coupon.type = type;
    if (type === CouponDiscountType.money) {
      coupon.discountValue = discount;
    } else {
      coupon.discountPorcent = discount / 100;
    }
    // ToDo: validar qdo for tipo Money e não tiver valor (cadastro do cupom)
    categoriesIds.forEach((ctgId) => {
      if (!coupon.categories) {
        coupon.categories = [Util.giveMeAValidCategory(ctgId)];
      }
      coupon.categories.push(this.giveMeAValidCategory(ctgId));
    });

    return coupon;
  }

  static giveMeAValidCategory(id = '1', name = 'batata'): Category {
    const ctg = new Category();
    ctg.id = id;
    ctg.name = name;
    return ctg;
  }

  static giveMeAValidPaymentMethod(methodName = 'visa') {
    const payment = new Payment();
    payment.id = '1';
    payment.methodName = methodName;
    return payment;
  }
}
