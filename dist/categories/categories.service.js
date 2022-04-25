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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
const stores_service_1 = require("../stores/stores.service");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, storesService) {
        this.categoryRepository = categoryRepository;
        this.storesService = storesService;
    }
    async create(createCategoryDto, typeOfCategory, storeId) {
        const category = this.categoryRepository.create();
        category.name = createCategoryDto.name;
        category.type = typeOfCategory;
        if (typeOfCategory === 'product') {
            category.storeProductsId = storeId;
        }
        return this.categoryRepository.save(category);
    }
    async updateCategory(updateCategoryDto, id) {
        const category = await this.categoryRepository.findOne(id, {
            where: {
                type: 'store'
            }
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.categoryRepository.update(category.id, updateCategoryDto);
    }
    async findAll() {
        return this.categoryRepository.find({
            where: {
                type: 'store',
            },
        });
    }
    async findAllByIds(ids) {
        return this.categoryRepository.findByIds(ids);
    }
    async findAllByIdsTypeStore(ids) {
        return this.categoryRepository.find({
            where: {
                id: (0, typeorm_2.In)(ids),
                type: 'store',
            },
        });
    }
    async findStoresCategories(findCategoriesDto) {
        const whereFind = {
            type: 'store',
        };
        if (findCategoriesDto.categoryId) {
            whereFind['id'] = findCategoriesDto.categoryId;
        }
        return this.categoryRepository.find({
            where: whereFind,
        });
    }
    async findProductsCategories(findCategoriesProductsDto) {
        const whereFind = {
            storeProductsId: findCategoriesProductsDto.storeId,
            type: 'product',
        };
        if (findCategoriesProductsDto.categoryId) {
            whereFind['id'] = findCategoriesProductsDto.categoryId;
        }
        return this.categoryRepository.find({
            where: whereFind,
        });
    }
    async findOne(id) {
        return this.categoryRepository.findOne(id);
    }
    async update(findCategoriesProductsDto, updateCategoryDto) {
        return this.categoryRepository.update({
            id: findCategoriesProductsDto.categoryId,
            storeProductsId: findCategoriesProductsDto.storeId,
        }, updateCategoryDto);
    }
    async remove(findCategoriesProductsDto) {
        const category = await this.findProductsCategories(findCategoriesProductsDto);
        if (!category) {
            throw new common_1.NotFoundException('category Not found');
        }
        return this.categoryRepository.delete(category[0].id);
    }
    async deleteStoreCategory(id) {
        return this.categoryRepository.delete(id);
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => stores_service_1.StoresService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stores_service_1.StoresService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map