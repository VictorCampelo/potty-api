"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBuyerhistoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_buyerhistory_dto_1 = require("./create-buyerhistory.dto");
class UpdateBuyerhistoryDto extends (0, swagger_1.PartialType)(create_buyerhistory_dto_1.CreateBuyerhistoryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBuyerhistoryDto = UpdateBuyerhistoryDto;
//# sourceMappingURL=update-buyerhistory.dto.js.map