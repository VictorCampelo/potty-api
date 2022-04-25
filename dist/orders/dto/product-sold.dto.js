"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSoldDto = void 0;
const openapi = require("@nestjs/swagger");
class ProductSoldDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, order_id: { required: true, type: () => Number }, name: { required: true, type: () => String }, amount: { required: true, type: () => Number } };
    }
}
exports.ProductSoldDto = ProductSoldDto;
//# sourceMappingURL=product-sold.dto.js.map