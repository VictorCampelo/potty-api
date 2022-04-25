"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const stores_module_1 = require("./../stores/stores.module");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const typeorm_1 = require("@nestjs/typeorm");
const files_module_1 = require("../files/files.module");
const passport_1 = require("@nestjs/passport");
const categories_module_1 = require("../categories/categories.module");
const users_module_1 = require("../users/users.module");
const product_entity_1 = require("./product.entity");
let ProductsModule = class ProductsModule {
    configure(consumer) {
        consumer
            .apply((req, res, next) => {
            if (typeof req.headers.app !== 'string' ||
                !/^catalog$|^marketplace$/g.test(req.headers.app)) {
                throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
            }
            next();
        })
            .forRoutes('products/related');
    }
};
ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            files_module_1.FilesModule,
            stores_module_1.StoresModule,
            categories_module_1.CategoriesModule,
            users_module_1.UsersModule,
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService],
        exports: [products_service_1.ProductsService],
    })
], ProductsModule);
exports.ProductsModule = ProductsModule;
//# sourceMappingURL=products.module.js.map