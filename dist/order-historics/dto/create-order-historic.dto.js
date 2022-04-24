"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderHistoricDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateOrderHistoricDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { storeId: { required: true, type: () => String }, orderId: { required: true, type: () => String }, productId: { required: true, type: () => String }, productQtd: { required: true, type: () => Number }, productPrice: { required: true, type: () => Number }, customerId: { required: true, type: () => String }, productParcels: { required: false, type: () => Number }, paymentMethod: { required: true, type: () => String } };
    }
}
exports.CreateOrderHistoricDto = CreateOrderHistoricDto;
//# sourceMappingURL=create-order-historic.dto.js.map