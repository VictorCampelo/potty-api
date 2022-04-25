"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProductsDto = void 0;
const openapi = require("@nestjs/swagger");
class FindProductsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { limit: { required: false, type: () => Number }, offset: { required: false, type: () => Number }, loadRelations: { required: false, type: () => Boolean }, loadLastSolds: { required: false, type: () => Boolean }, loadLastCreated: { required: false, type: () => Boolean }, files: { required: false, type: () => Boolean }, categories: { required: false, type: () => Boolean }, store: { required: false, type: () => Boolean }, order: { required: false, type: () => Boolean }, feedbacks: { required: false, type: () => Boolean }, feedbacksUser: { required: false, type: () => Boolean }, starsMax: { required: false, type: () => Number }, starsMin: { required: false, type: () => Number }, starsEq: { required: false, type: () => Number }, starsNeq: { required: false, type: () => Number }, take: { required: false, type: () => Number }, page: { required: false, type: () => Number } };
    }
}
exports.FindProductsDto = FindProductsDto;
//# sourceMappingURL=find-products.dto.js.map