"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_historic_entity_1 = require("../../../order-historics/entities/order-historic.entity");
const product_1 = __importDefault(require("./product"));
class OrderHistoricsUtil {
    static giveMeAValidOrderHistoric(id = '1') {
        const orderHistoric = new order_historic_entity_1.OrderHistoric();
        orderHistoric.product = product_1.default.giveMeAValidProduct(id, '1', 10, 10, 'produto teste');
        orderHistoric.productId = product_1.default.giveMeAValidProduct(id, '1', 10, 10, 'produto teste').id;
        return orderHistoric;
    }
}
exports.default = OrderHistoricsUtil;
//# sourceMappingURL=orderHistorics.js.map