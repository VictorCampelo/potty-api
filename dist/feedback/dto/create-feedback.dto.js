"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeedbackDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateFeedbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { star: { required: true, type: () => Number }, comment: { required: false, type: () => String }, productId: { required: true, type: () => String }, orderId: { required: true, type: () => String } };
    }
}
exports.CreateFeedbackDto = CreateFeedbackDto;
//# sourceMappingURL=create-feedback.dto.js.map