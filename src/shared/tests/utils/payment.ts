import { Payment } from "src/payments/entities/payments.entity";

export default class PaymentUtils {


  static giveMeAValidPaymentMethod(methodName = 'visa') {
    const payment = new Payment();
    payment.id = '1';
    payment.methodName = methodName;
    return payment;
  }
}
