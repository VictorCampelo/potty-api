"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrdersDto = void 0;
const openapi = require("@nestjs/swagger");
const base_query_parameters_dto_1 = require("../../shared/dto/base-query-parameters.dto");
class findOrdersDto extends base_query_parameters_dto_1.BaseQueryParametersDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { start: { required: false, type: () => Date }, end: { required: false, type: () => Date }, confirmed: { required: false, type: () => Boolean } };
    }
}
exports.findOrdersDto = findOrdersDto;
//# sourceMappingURL=find-order.dto.js.map