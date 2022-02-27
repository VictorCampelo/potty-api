import { Store } from "src/stores/store.entity";
import PaymentUtils from "./payment";

export default class StoreUtils {

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
          store.paymentMethods.push(PaymentUtils.giveMeAValidPaymentMethod(p));
        } else {
          store.paymentMethods = [PaymentUtils.giveMeAValidPaymentMethod(p)];
        }
      });
    }
    // store.paymentMethods = [this.giveMeAValidPaymentMethod()];
    return store;
  }

}
