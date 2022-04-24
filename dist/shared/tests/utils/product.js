"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_entity_1 = require("../../../products/product.entity");
const category_1 = __importDefault(require("./category"));
class ProductUtils {
    static giveMeAValidProduct(id, storeId, price, inventory, title, discount) {
        const product = new product_entity_1.Product();
        product.id = id;
        product.storeId = storeId;
        product.price = price;
        product.inventory = inventory;
        product.title = title;
        product.discount = discount;
        product.categories = [
            category_1.default.giveMeAValidCategory('1', 'Calçados'),
            category_1.default.giveMeAValidCategory('2', 'Bebidas'),
        ];
        return product;
    }
}
exports.default = ProductUtils;
//# sourceMappingURL=product.js.map