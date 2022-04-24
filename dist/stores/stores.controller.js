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
exports.StoresController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const error_handling_1 = require("../configs/error-handling");
const multer_config_1 = require("../configs/multer.config");
const user_roles_enum_1 = require("../users/user-roles.enum");
const user_entity_1 = require("../users/user.entity");
const create_store_dto_1 = require("./dto/create-store.dto");
const find_store_dto_1 = require("./dto/find-store.dto");
const stores_service_1 = require("./stores.service");
let StoresController = class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    async findAll() {
        try {
            return await this.storesService.findAll();
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOneById(id) {
        try {
            return await this.storesService.findOne(id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async getStoreMe(user) {
        try {
            return await this.storesService.findStoreMe(user.id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findByCategory(catId) {
        try {
            return this.storesService.findFromCategory(catId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOneByName(name) {
        try {
            return await this.storesService.findOneByName(name);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async update(user, updateStoreDto, { avatar, background, }) {
        const { storeDto } = JSON.parse(JSON.stringify(updateStoreDto));
        try {
            return await this.storesService.update(user.storeId, JSON.parse(storeDto), [avatar ? avatar[0] : null, background ? background[0] : null]);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async remove(id) {
        try {
            return await this.storesService.remove(+id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async addLikeToStore(name, user) {
        try {
            const store = await this.storesService.addLike(user, name);
            return {
                store: store,
                message: 'Sucessfuly added one like to the Store.',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOnSearch(query) {
        try {
            return await this.storesService.findOnSearch(query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOnSearchProducts(storeId, query) {
        try {
            return await this.storesService.findOnSearchProduct(storeId, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async createStore(storeAvatar, createStore, user) {
        try {
            createStore.avatar = storeAvatar;
            return this.storesService.create(createStore, user.id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./store.entity").Store] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    openapi.ApiResponse({ status: 200, type: require("./store.entity").Store }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findOneById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    (0, common_1.Get)('me'),
    openapi.ApiResponse({ status: 200, type: require("../users/user.entity").User }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getStoreMe", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId'),
    openapi.ApiResponse({ status: 200, type: [require("./store.entity").Store] }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('find/:name'),
    openapi.ApiResponse({ status: 200, type: require("./store.entity").Store }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findOneByName", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        {
            name: 'avatar',
            maxCount: 1,
        },
        {
            name: 'background',
            maxCount: 1,
        },
    ], multer_config_1.multerOptions)),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    openapi.ApiResponse({ status: 200, type: require("./store.entity").Store }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('toggleFavorite/:name'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "addLikeToStore", null);
__decorate([
    (0, common_1.Get)('search'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_store_dto_1.FindStoreDto]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findOnSearch", null);
__decorate([
    (0, common_1.Get)('searchProducts/:storeId'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, find_store_dto_1.FindStoreDto]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findOnSearchProducts", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', multer_config_1.multerOptions)),
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 201, type: require("./store.entity").Store }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_store_dto_1.CreateStoreDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "createStore", null);
StoresController = __decorate([
    (0, swagger_1.ApiTags)('stores'),
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
exports.StoresController = StoresController;
//# sourceMappingURL=stores.controller.js.map