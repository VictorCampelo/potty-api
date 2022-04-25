"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CategoriesModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const stores_module_1 = require("../stores/stores.module");
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const categories_controller_1 = require("./categories.controller");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./category.entity");
const passport_1 = require("@nestjs/passport");
let CategoriesModule = CategoriesModule_1 = class CategoriesModule {
};
CategoriesModule = CategoriesModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([category_entity_1.Category]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            CategoriesModule_1,
            (0, common_1.forwardRef)(() => stores_module_1.StoresModule),
        ],
        controllers: [categories_controller_1.CategoriesController],
        providers: [categories_service_1.CategoriesService],
        exports: [categories_service_1.CategoriesService],
    })
], CategoriesModule);
exports.CategoriesModule = CategoriesModule;
//# sourceMappingURL=categories.module.js.map