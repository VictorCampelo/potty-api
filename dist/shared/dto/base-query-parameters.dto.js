"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueryParametersDto = void 0;
const openapi = require("@nestjs/swagger");
class BaseQueryParametersDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { sort: { required: false, type: () => String }, limit: { required: false, type: () => Number }, offset: { required: false, type: () => Number }, take: { required: false, type: () => Number }, page: { required: false, type: () => Number } };
    }
}
exports.BaseQueryParametersDto = BaseQueryParametersDto;
//# sourceMappingURL=base-query-parameters.dto.js.map