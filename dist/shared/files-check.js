"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const multer_1 = require("multer");
function checkXlsxFile() {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    return (0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
            filename: (req, file, cb) => {
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
                return callback(new Error('Only excel files are allowed!'), false);
            }
            callback(null, true);
        },
    });
}
exports.default = checkXlsxFile;
//# sourceMappingURL=files-check.js.map