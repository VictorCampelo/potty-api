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
exports.CategoriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const error_handling_1 = require("../configs/error-handling");
const user_roles_enum_1 = require("../users/user-roles.enum");
const user_entity_1 = require("../users/user.entity");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const productsByCategory = 'products/:storeId/category/:categoryId';
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async findAllPublicCategories() {
        try {
            return await this.categoriesService.findAll();
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async createPublicCategory(createCategoryDto) {
        try {
            return await this.categoriesService.create(createCategoryDto, 'store');
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateCategory(updateCategoryDto, id) {
        try {
            return await this.categoriesService.updateCategory(updateCategoryDto, id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async deleteCategory(id) {
        try {
            return this.categoriesService.deleteStoreCategory(id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async createProductStoreCategory(createCategoryDto, user) {
        try {
            return await this.categoriesService.create(createCategoryDto, 'product', user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAllProductsCategories(storeId) {
        try {
            return await this.categoriesService.findProductsCategories({
                storeId,
            });
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOneStoresCategories(storeId, categoryId) {
        try {
            return await this.categoriesService.findProductsCategories({
                storeId,
                categoryId,
            });
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async update(storeId, categoryId, updateCategoryDto) {
        try {
            return await this.categoriesService.update({ categoryId, storeId }, updateCategoryDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async remove(storeId, categoryId) {
        try {
            return await this.categoriesService.remove({ categoryId, storeId });
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./category.entity").Category] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAllPublicCategories", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201, type: require("./category.entity").Category }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createPublicCategory", null);
__decorate([
    (0, common_1.Patch)('update/:categoryId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_dto_1.UpdateCategoryDto, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('delete/:categoryId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Post)('product'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 201, type: require("./category.entity").Category }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createProductStoreCategory", null);
__decorate([
    (0, common_1.Get)('products/:storeId'),
    openapi.ApiResponse({ status: 200, type: [require("./category.entity").Category] }),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAllProductsCategories", null);
__decorate([
    (0, common_1.Get)(productsByCategory),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200, type: [require("./category.entity").Category] }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOneStoresCategories", null);
__decorate([
    (0, common_1.Patch)(productsByCategory),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(productsByCategory),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "remove", null);
CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map