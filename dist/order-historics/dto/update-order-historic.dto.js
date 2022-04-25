"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderHistoricDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_order_historic_dto_1 = require("./create-order-historic.dto");
class UpdateOrderHistoricDto extends (0, swagger_1.PartialType)(create_order_historic_dto_1.CreateOrderHistoricDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateOrderHistoricDto = UpdateOrderHistoricDto;
//# sourceMappingURL=update-order-historic.dto.js.map