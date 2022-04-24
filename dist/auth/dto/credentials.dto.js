"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsDto = void 0;
const openapi = require("@nestjs/swagger");
class CredentialsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.CredentialsDto = CredentialsDto;
//# sourceMappingURL=credentials.dto.js.map