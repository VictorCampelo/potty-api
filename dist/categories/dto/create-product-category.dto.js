"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateProductCategoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, store: { required: true, type: () => require("../../stores/store.entity").Store } };
    }
}
exports.CreateProductCategoryDto = CreateProductCategoryDto;
//# sourceMappingURL=create-product-category.dto.js.map