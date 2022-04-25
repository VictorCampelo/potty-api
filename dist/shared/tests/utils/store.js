"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_entity_1 = require("../../../stores/store.entity");
const payment_1 = __importDefault(require("./payment"));
class StoreUtils {
    static giveMeAValidStore(id, phone, paymentMethods, name = 'minha loja') {
        const store = new store_entity_1.Store();
        store.name = name;
        store.id = id;
        store.phone = phone;
        if (paymentMethods) {
            paymentMethods.forEach((p) => {
                if (store.paymentMethods) {
                    store.paymentMethods.push(payment_1.default.giveMeAValidPaymentMethod(p));
                }
                else {
                    store.paymentMethods = [payment_1.default.giveMeAValidPaymentMethod(p)];
                }
            });
        }
        return store;
    }
}
exports.default = StoreUtils;
//# sourceMappingURL=store.js.map