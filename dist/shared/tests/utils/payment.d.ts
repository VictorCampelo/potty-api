import { Payment } from 'src/payments/entities/payments.entity';
export default class PaymentUtils {
    static giveMeAValidPaymentMethod(methodName?: string): Payment;
}
