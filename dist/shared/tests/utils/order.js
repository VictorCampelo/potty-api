"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_entity_1 = require("../../../orders/order.entity");
const orderHistorics_1 = __importDefault(require("./orderHistorics"));
class OrderUtils {
    static giveMeAValidCreatedOrder(id) {
        const order = new order_entity_1.Order();
        order.id = id;
        return order;
    }
    static giveMeAValidOrder(id = '1', historicsId = '1') {
        const order = new order_entity_1.Order();
        order.id = id;
        order.orderHistorics = [orderHistorics_1.default.giveMeAValidOrderHistoric(historicsId)];
        return order;
    }
}
exports.default = OrderUtils;
//# sourceMappingURL=order.js.map