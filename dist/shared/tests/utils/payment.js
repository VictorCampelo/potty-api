"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payments_entity_1 = require("../../../payments/entities/payments.entity");
class PaymentUtils {
    static giveMeAValidPaymentMethod(methodName = 'visa') {
        const payment = new payments_entity_1.Payment();
        payment.id = '1';
        payment.methodName = methodName;
        return payment;
    }
}
exports.default = PaymentUtils;
//# sourceMappingURL=payment.js.map