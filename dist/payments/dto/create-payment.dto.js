"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDto = void 0;
const openapi = require("@nestjs/swagger");
class CreatePaymentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { methodName: { required: true, type: () => String }, allowParcels: { required: true, type: () => Boolean } };
    }
}
exports.CreatePaymentDto = CreatePaymentDto;
//# sourceMappingURL=create-payment.dto.js.map