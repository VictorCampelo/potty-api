"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChangePasswordDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String, minLength: 8, maxLength: 32 }, passwordConfirmation: { required: true, type: () => String, minLength: 8, maxLength: 32 } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({
        message: 'Informe uma senha válida',
    }),
    (0, class_validator_1.MinLength)(8, {
        message: 'A senha deve ter no mínimo 6 caracteres',
    }),
    (0, class_validator_1.MaxLength)(32, {
        message: 'A senha deve ter no máximo 32 caracteres.',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({
        message: 'Informe uma senha válida',
    }),
    (0, class_validator_1.MinLength)(8, {
        message: 'A senha deve ter no mínimo 8 caracteres',
    }),
    (0, class_validator_1.MaxLength)(32, {
        message: 'A senha deve ter no máximo 32 caracteres.',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "passwordConfirmation", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
//# sourceMappingURL=change-password.dto.js.map