"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMostSolds = void 0;
const openapi = require("@nestjs/swagger");
class FindMostSolds {
    static _OPENAPI_METADATA_FACTORY() {
        return { start: { required: false, type: () => Date }, end: { required: false, type: () => Date }, limit: { required: false, type: () => Number }, offset: { required: false, type: () => Number }, confirmed: { required: false, type: () => Boolean } };
    }
}
exports.FindMostSolds = FindMostSolds;
//# sourceMappingURL=find-most-solds.dto.js.map