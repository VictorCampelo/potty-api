"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresModule = void 0;
const files_module_1 = require("./../files/files.module");
const common_1 = require("@nestjs/common");
const stores_service_1 = require("./stores.service");
const stores_controller_1 = require("./stores.controller");
const typeorm_1 = require("@nestjs/typeorm");
const stores_repository_1 = require("./stores.repository");
const users_module_1 = require("../users/users.module");
const passport_1 = require("@nestjs/passport");
const categories_module_1 = require("../categories/categories.module");
const payments_module_1 = require("../payments/payments.module");
let StoresModule = class StoresModule {
};
StoresModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([stores_repository_1.StoreRepository]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            users_module_1.UsersModule,
            files_module_1.FilesModule,
            categories_module_1.CategoriesModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [stores_controller_1.StoresController],
        providers: [stores_service_1.StoresService],
        exports: [stores_service_1.StoresService],
    })
], StoresModule);
exports.StoresModule = StoresModule;
//# sourceMappingURL=stores.module.js.map