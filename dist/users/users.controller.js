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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const find_users_query_dto_1 = require("./dto/find-users-query.dto");
const update_users_dto_1 = require("./dto/update-users.dto");
const user_roles_enum_1 = require("./user-roles.enum");
const user_entity_1 = require("./user.entity");
const users_service_1 = require("./users.service");
const sentry_interceptor_1 = require("../interceptors/sentry.interceptor");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const error_handling_1 = require("../configs/error-handling");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createAdminUser(createUserDto) {
        try {
            const user = await this.usersService.createAdminUser(createUserDto);
            return {
                user,
                message: 'Administrador cadastrado com sucesso',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateUserTerms() {
        try {
            const result = await this.usersService.updateUserTerms();
            return {
                result,
                message: 'Success. Every non-admin user now has to accept the new use terms.',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async createOwnerUser(createUserDto) {
        try {
            const user = await this.usersService.createOwnerUser(createUserDto);
            return {
                user,
                message: 'Dono cadastrado com sucesso',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async getAuthUser(authUser) {
        try {
            const user = await this.usersService.findUserById(authUser.id);
            return {
                user,
                message: 'Usuário encontrado',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async getUserMe(user) {
        try {
            return await this.usersService.findUserMe(user.id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findUserById(id) {
        try {
            const user = await this.usersService.findUserById(id);
            return {
                user,
                message: 'Usuário encontrado',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateUser(updateUserDto, file, user, id) {
        try {
            return this.usersService.updateUser({ id, updateUserDto, file });
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateNormalUser(updateUserDto, file, user) {
        try {
            const id = user.id;
            return await this.usersService.updateUser({ id, updateUserDto, file });
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async deleteUser(id) {
        try {
            await this.usersService.deleteUser(id);
            return {
                message: 'Usuário removido com sucesso',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findUsers(query) {
        try {
            const found = await this.usersService.findUsers(query);
            return {
                found,
                message: 'Usuários encontrados',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Post)(),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-user.dto").ReturnUserDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAdminUser", null);
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Post)('terms'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserTerms", null);
__decorate([
    (0, swagger_1.ApiTags)('owner'),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./dto/return-user.dto").ReturnUserDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createOwnerUser", null);
__decorate([
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Get a authenticate user informations' }),
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./dto/return-user.dto").ReturnUserDto }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAuthUser", null);
__decorate([
    (0, common_1.Get)('me'),
    openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserMe", null);
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Get)(':id'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200, type: require("./dto/return-user.dto").ReturnUserDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUserById", null);
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    (0, common_1.Patch)(':id'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_users_dto_1.UpdateUserDto, Object, user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    (0, common_1.Patch)(),
    openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_users_dto_1.UpdateUserDto, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateNormalUser", null);
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Delete)(':id'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Get)(),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_users_query_dto_1.FindUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUsers", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map