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
exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, maxLength: 200 }, firstName: { required: true, type: () => String, maxLength: 200 }, lastName: { required: true, type: () => String, maxLength: 200 }, password: { required: true, type: () => String, minLength: 6 }, passwordConfirmation: { required: true, type: () => String, minLength: 6 }, zipcode: { required: false, type: () => String }, street: { required: false, type: () => String }, addressNumber: { required: false, type: () => Number }, neighborhood: { required: false, type: () => String }, complement: { required: false, type: () => String }, city: { required: false, type: () => String }, uf: { required: false, type: () => String }, logradouro: { required: false, type: () => String }, googleId: { required: false, type: () => String }, facebookId: { required: false, type: () => String }, chosenPlan: { required: true, type: () => String, pattern: /mensal|trimestral|anual/ } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Informe um endereço de email',
    }),
    (0, class_validator_1.IsEmail)({}, {
        message: 'Informe um endereço de email válido',
    }),
    (0, class_validator_1.MaxLength)(200, {
        message: 'O endereço de email deve ter menos de 200 caracteres',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Informe o primeiro nome do usuário',
    }),
    (0, class_validator_1.MaxLength)(200, {
        message: 'O primeiro nome deve ter menos de 200 caracteres',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Informe o segundo nome do usuário',
    }),
    (0, class_validator_1.MaxLength)(200, {
        message: 'O segundo nome deve ter menos de 200 caracteres',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Informe uma senha',
    }),
    (0, class_validator_1.MinLength)(6, {
        message: 'A senha deve ter no mínimo 6 caracteres',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Informe a confirmação de senha',
    }),
    (0, class_validator_1.MinLength)(6, {
        message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "passwordConfirmation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "zipcode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "addressNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "complement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "uf", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "logradouro", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "googleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "facebookId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/mensal|trimestral|anual/, {
        message: 'Invalid Plan ',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "chosenPlan", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map