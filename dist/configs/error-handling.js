"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandling = void 0;
const common_1 = require("@nestjs/common");
class ErrorHandling {
    constructor(error) {
        console.log('error >>>>>>', error);
        if (!error.status) {
            throw error;
        }
        throw new common_1.HttpException({
            status: error.status,
            error: error.message,
        }, error.status);
    }
}
exports.ErrorHandling = ErrorHandling;
//# sourceMappingURL=error-handling.js.map