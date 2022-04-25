"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let CustomValidationPipe = class CustomValidationPipe {
    async transform(value, metaData) {
        if (this.isEmpty(value)) {
            throw new common_1.HttpException(`Validation failed: No payload provided`, common_1.HttpStatus.BAD_REQUEST);
        }
        const object = (0, class_transformer_1.plainToClass)(metaData.metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            throw new common_1.HttpException(`Validation failed: ${this.formatErrors(errors)}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return value;
    }
    isEmpty(value) {
        if (Object.keys(value).length < 1) {
            return true;
        }
        return false;
    }
    formatErrors(errors) {
        return errors
            .map((error) => {
            error.map((key) => {
                return error.constraints[key];
            });
        })
            .join(', ');
    }
};
CustomValidationPipe = __decorate([
    (0, common_1.Injectable)()
], CustomValidationPipe);
exports.CustomValidationPipe = CustomValidationPipe;
//# sourceMappingURL=validator.pipe.js.map