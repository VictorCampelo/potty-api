"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeedbackDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateFeedbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { star: { required: true, type: () => Number }, comment: { required: false, type: () => String } };
    }
}
exports.UpdateFeedbackDto = UpdateFeedbackDto;
//# sourceMappingURL=update-feedback.dto.js.map