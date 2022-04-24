"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductImagesDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateProductImagesDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { product_id: { required: true, type: () => String }, toBeDeleted: { required: true, type: () => [String] }, files: { required: true, type: () => [Object] } };
    }
}
exports.UpdateProductImagesDto = UpdateProductImagesDto;
//# sourceMappingURL=update-product-images.dto.js.map