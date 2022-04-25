"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerConfig = void 0;
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config();
exports.mailerConfig = {
    template: {
        dir: path.resolve(__dirname, '..', '..', 'templates'),
        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
        options: {
            extName: '.hbs',
            layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
        },
    },
    transport: {
        host: process.env.HOST_MAIL,
        port: parseInt(process.env.PORT_MAIL),
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL,
        },
    },
    defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
    },
};
//# sourceMappingURL=mailer.config.js.map