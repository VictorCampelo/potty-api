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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const error_handling_1 = require("../configs/error-handling");
const user_roles_enum_1 = require("../users/user-roles.enum");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const user_entity_1 = require("../users/user.entity");
const auth_service_1 = require("./auth.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const create_user_store_dto_1 = require("./dto/create-user-store.dto");
const credentials_dto_1 = require("./dto/credentials.dto");
const get_user_decorator_1 = require("./get-user.decorator");
const multer_config_1 = require("../configs/multer.config");
const role_decorator_1 = require("./role.decorator");
const change_plan_dto_1 = require("./dto/change-plan-dto");
const roles_guard_1 = require("./roles.guard");
const common_2 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createUserAndStore(storeAvatar, createUserAndStore) {
        const { storeDto, userDto } = JSON.parse(JSON.stringify(createUserAndStore));
        try {
            const user = await this.authService.signUpOwner({
                storeDto: JSON.parse(storeDto),
                userDto: JSON.parse(userDto),
            }, storeAvatar);
            return { user: user, message: 'User and Store createds.' };
        }
        catch (error) {
            if (error.detail &&
                error.detail.includes('Key (name)=(') &&
                error.detail.includes(') already exists.')) {
                error.status = 409;
                error.message = 'Store name is currently taken.';
            }
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async signUp(createUserDto) {
        try {
            await this.authService.signUp(createUserDto, user_roles_enum_1.UserRole.USER);
            return {
                message: 'Cadastro realizado com sucesso',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async signIn(credentiaslsDto) {
        try {
            return await this.authService.signIn(credentiaslsDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async confirmEmail(activateEmailQuery) {
        try {
            if (await this.authService.confirmEmail(activateEmailQuery)) {
                return {
                    message: 'Email confirmado',
                };
            }
            return {
                message: 'Erro ao confirmar o seu E-mail',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async sendEmailConfirmation(email) {
        try {
            await this.authService.sendEmailConfirmation(email);
            return {
                message: 'Foi enviado um email com instruções para ativação da sua conta',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async sendRecoverPasswordEmail(email) {
        try {
            await this.authService.sendRecoverPasswordEmail(email);
            return {
                message: 'Foi enviado um email com instruções para resetar sua senha',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async resetPassword(token, changePasswordDto) {
        try {
            await this.authService.resetPassword(token, changePasswordDto);
            return {
                message: 'Senha alterada com sucesso',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async changePassword(id, changePasswordDto, user) {
        try {
            if (user.role !== user_roles_enum_1.UserRole.ADMIN && user.id.toString() !== id)
                throw new common_1.UnauthorizedException('Você não tem permissão para realizar esta operação');
            await this.authService.changePassword(id, changePasswordDto);
            return {
                message: 'Senha alterada',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    getMe(user) {
        try {
            return user;
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async checkEmail(emailDto) {
        try {
            return { message: await this.authService.findByEmail(emailDto.email) };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async changeUserPlan(changePlanDto) {
        try {
            return await this.authService.changeUserPlan(changePlanDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async facebookAuth() {
        return common_1.HttpStatus.OK;
    }
    async googleAuth(_req) {
    }
    async facebookRedirect(req, res) {
        const url = await this.authService.socialsLogin(req, 'facebook');
        if (typeof url !== 'string') {
            res.redirect(`https://www.boadevenda.com.br/cadastro?email=${url.email}&firstName=${url.firstName}&lastName=${url.lastName}&facebookId=${url.id}`);
        }
        else {
            res.redirect(url);
        }
    }
    async googleRedirect(req, res) {
        const url = await this.authService.socialsLogin(req, 'google');
        if (typeof url !== 'string') {
            res.redirect(`https://www.boadevenda.com.br/cadastro?email=${url.email}&firstName=${url.firstName}&lastName=${url.lastName}&googleId=${url.id}`);
        }
        else {
            res.redirect(url);
        }
    }
};
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', multer_config_1.multerOptions)),
    (0, common_1.Post)('/signup-store'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: create_user_store_dto_1.CreateUserStore }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_store_dto_1.CreateUserStore]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUserAndStore", null);
__decorate([
    (0, common_1.Post)('/signup'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('/signin'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [credentials_dto_1.CredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Patch)('/token'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)('/send-confirmation-email'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailConfirmation", null);
__decorate([
    (0, common_1.Post)('/send-recover-email'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendRecoverPasswordEmail", null);
__decorate([
    (0, common_1.Patch)('/reset-password/:token'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)('/change-password/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    openapi.ApiResponse({ status: 200, type: require("../users/user.entity").User }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", user_entity_1.User)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('/checkEmail'),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Patch)('/plan'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200, type: require("../users/user.entity").User }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_plan_dto_1.ChangePlanDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeUserPlan", null);
__decorate([
    (0, common_1.Get)('facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('facebook/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookRedirect", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleRedirect", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map