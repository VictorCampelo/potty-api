"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuyerhistoryDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateBuyerhistoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accountStatus: { required: true, type: () => String }, paymentMethod: { required: true, type: () => String }, user: { required: true, type: () => require("../../users/user.entity").User } };
    }
}
exports.CreateBuyerhistoryDto = CreateBuyerhistoryDto;
//# sourceMappingURL=create-buyerhistory.dto.js.map