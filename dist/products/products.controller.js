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
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const find_products_dto_1 = require("./dto/find-products.dto");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const update_product_dto_1 = require("./dto/update-product.dto");
const role_decorator_1 = require("../auth/role.decorator");
const user_roles_enum_1 = require("../users/user-roles.enum");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const update_product_images_dto_1 = require("./dto/update-product-images.dto");
const create_product_dto_1 = require("./dto/create-product.dto");
const user_entity_1 = require("../users/user.entity");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const error_handling_1 = require("../configs/error-handling");
const multer_config_1 = require("../configs/multer.config");
const find_promoted_dto_1 = require("./dto/find-promoted.dto");
const unique_update_dto_1 = require("./dto/unique-update.dto");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findRelatedProducts(request, relatedDto) {
        try {
            if (request.headers.app === 'marketplace') {
                return this.productsService.findRelatedMarketplace(relatedDto);
            }
            return this.productsService.findRelatedCatalog(relatedDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findWithDiscount(findPromotedDto) {
        try {
            return await this.productsService.findWithDiscount(findPromotedDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findFromCategory(categoryId, fromCategoryDto) {
        try {
            return await this.productsService.findFromCategory(categoryId, fromCategoryDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOne(id, query) {
        try {
            return this.productsService.findOne(id, query);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAllProduct(storeId, findProductsDto) {
        try {
            return this.productsService.findAll(storeId, findProductsDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async create(createProductDto, user, images) {
        try {
            createProductDto.files = images;
            const product = await this.productsService.createProduct(createProductDto, user);
            return { product, message: 'Product created successfully' };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateProductDetails(id, updateProductDto) {
        try {
            const product = await this.productsService.updateProductDetails(id, updateProductDto);
            return { product: product, message: 'Product successfully updated.' };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateProductImages(id, updateProductImagesDto, images) {
        try {
            updateProductImagesDto.product_id = id;
            updateProductImagesDto.files = images;
            const product = await this.productsService.updateProductImages(updateProductImagesDto);
            return {
                product: product,
                message: 'Product images sucessfully updated.',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateProduct(id, uniqueUpdateDto, images) {
        try {
            uniqueUpdateDto.product_id = id;
            uniqueUpdateDto.files = images;
            const product = await this.productsService.updateProduct(uniqueUpdateDto);
            return {
                product: product,
                message: 'Product sucessfully updated.',
            };
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async remove(id) {
        try {
            return await this.productsService.remove(id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Get)('related'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findRelatedProducts", null);
__decorate([
    (0, common_1.Get)('promoted'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_promoted_dto_1.FindPromotedDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findWithDiscount", null);
__decorate([
    (0, common_1.Get)('category/:id'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findFromCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./product.entity").Product }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, find_products_dto_1.FindProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('store/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, find_products_dto_1.FindProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Creates a product',
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 3, multer_config_1.multerOptions)),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto,
        user_entity_1.User, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        deprecated: true,
    }),
    (0, common_1.Patch)('details/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        deprecated: true,
    }),
    (0, common_1.Patch)('images/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 3, {
        storage: (0, multer_1.memoryStorage)(),
    })),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_images_dto_1.UpdateProductImagesDto, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductImages", null);
__decorate([
    (0, common_1.Patch)('update/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 3, {
        storage: (0, multer_1.memoryStorage)(),
    })),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, unique_update_dto_1.UniqueUpdateDto, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map