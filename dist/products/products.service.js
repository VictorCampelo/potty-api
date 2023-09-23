"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateResponse = exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const _ = __importStar(require("lodash"));
const categories_service_1 = require("../categories/categories.service");
const fileStorage_provider_1 = require("./../files/providers/fileStorage.provider");
const stores_service_1 = require("../stores/stores.service");
const users_service_1 = require("../users/users.service");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(productRepository, filesService, storesService, categoriesService, usersService) {
        this.productRepository = productRepository;
        this.filesService = filesService;
        this.storesService = storesService;
        this.categoriesService = categoriesService;
        this.usersService = usersService;
    }
    async amountSolds(storeId, startDate, endDate, limit, offset) {
        const params = [storeId, startDate, endDate];
        let query = `
    select distinct
      ohp."productId",
      ohp.qtd
    from
      product p, (
      select
        oh."productId",
        p.store_id,
        sum(oh."productQtd") as qtd
      from
        "order-historic" oh
      inner join 
        product p on p.id = oh."productId"
      where 
        oh."updatedAt" >= $2 and oh."updatedAt" <= $3
      group by oh."productId", p.store_id ) as ohp
    where ohp.store_id = $1 
    `;
        if (offset) {
            params.push(offset);
            query += `offset $${params.length} `;
        }
        if (limit) {
            params.push(limit);
            query += `limit $${params.length} `;
        }
        const products = await (0, typeorm_2.getConnection)().query(query, params);
        return (0, camelcase_keys_1.default)(products);
    }
    create() {
        return this.productRepository.create();
    }
    async saveAll(products) {
        return this.productRepository.save(products);
    }
    async createProduct(createProductDto, user) {
        const userWithPlan = await this.usersService.findUserById(user.id);
        const productAmount = await this.productRepository.find({
            where: {
                storeId: user.storeId,
            },
        });
        if (!userWithPlan.plan ||
            userWithPlan.plan.qtd_products <= productAmount.length) {
            throw new common_1.HttpException("You don't have a plan or your Products limit has expired", common_1.HttpStatus.PRECONDITION_FAILED);
        }
        const store = await this.storesService.findOneByUser(user.id);
        const product = this.productRepository.create();
        product.discount = createProductDto.discount;
        product.title = createProductDto.title;
        product.price = createProductDto.price;
        product.inventory = createProductDto.inventory;
        product.parcelAmount = createProductDto.parcelAmount;
        product.tags = createProductDto.tags ? createProductDto.tags : null;
        product.description = createProductDto.description
            ? createProductDto.description
            : null;
        product.store = store;
        if (createProductDto.files) {
            product.files = await this.filesService.saveFiles(createProductDto.files, `${store.name}/${product.title}`);
        }
        if (createProductDto.categoriesIds.length &&
            createProductDto.categoriesIds[0].length > 0) {
            product.categories = await this.categoriesService.findAllByIds(createProductDto.categoriesIds);
        }
        return product.save();
    }
    async findProductstByIds(ids) {
        return this.productRepository.findByIds(ids);
    }
    async findProductstByIdsAndStoreId(ids, storeId) {
        return this.productRepository.findByIds(ids, {
            where: {
                storeId,
            },
            relations: ['categories'],
        });
    }
    async findAll(storeId, findProducts) {
        const parsedTake = findProducts.take || 10;
        const parsedPage = findProducts.page || 1;
        const parsedSkip = (parsedPage - 1) * parsedTake;
        let orderingBy;
        if (findProducts.loadLastSolds) {
            orderingBy = {
                lastSold: 'DESC',
            };
        }
        else if (findProducts.loadLastCreated) {
            orderingBy = {
                createdAt: 'DESC',
            };
        }
        else if (findProducts.loadWithHighestPrice) {
            orderingBy = {
                price: 'DESC',
            };
        }
        else {
            orderingBy = {
                sumOrders: 'ASC',
                avgStars: 'ASC',
            };
        }
        const whereOpt = {
            storeId: storeId,
        };
        if (findProducts.starsEq) {
            whereOpt['avgStars'] = (0, typeorm_2.Equal)(findProducts.starsEq);
        }
        else if (findProducts.starsNeq) {
            whereOpt['avgStars'] = (0, typeorm_2.Not)(findProducts.starsNeq);
        }
        else {
            if (findProducts.starsMax) {
                whereOpt['avgStars'] = (0, typeorm_2.LessThanOrEqual)(findProducts.starsMax);
            }
            if (findProducts.starsMin) {
                whereOpt['avgStars'] = (0, typeorm_2.MoreThanOrEqual)(findProducts.starsMin);
            }
        }
        const products = await this.productRepository.findAndCount({
            relations: findProducts.loadRelations ? ['files', 'categories'] : [],
            where: whereOpt,
            skip: parsedSkip,
            take: parsedTake,
            order: orderingBy,
        });
        return paginateResponse(products, parsedPage, parsedSkip);
    }
    async findOne(id, findProducts) {
        const tables = [];
        const options = {};
        if (findProducts) {
            if (findProducts.files) {
                tables.push('files');
            }
            if (findProducts.store) {
                tables.push('store');
            }
            if (findProducts.order) {
                tables.push('orderHistorics');
                tables.push('orderHistorics.orders');
            }
            if (findProducts.feedbacks) {
                tables.push('feedbacks');
            }
            if (findProducts.categories) {
                tables.push('categories');
            }
            if (findProducts.feedbacksUser) {
                tables.push('feedbacks.user');
            }
            options['relations'] = tables;
        }
        return this.productRepository.findOne(id, options);
    }
    async updateProductDetails(id, updateProductDto) {
        if (updateProductDto.categoriesIds) {
            const product = await this.productRepository.findOne(id);
            product.categories = await this.categoriesService.findAllByIds(updateProductDto.categoriesIds);
            updateProductDto = _.omit(updateProductDto, 'categoriesIds');
            await product.save();
        }
        return this.productRepository.update(id, updateProductDto);
    }
    async saveProducts(products) {
        return this.productRepository.save(products);
    }
    async updateProductImages({ product_id, toBeDeleted, files, }) {
        const product = await this.findOne(product_id, {
            store: true,
            files: true,
        });
        if (!product) {
            throw new common_1.NotFoundException("The product_id sent doesn't matches any product on the database.");
        }
        if (toBeDeleted) {
            await this.filesService.removeFiles(toBeDeleted);
        }
        if (files) {
            if (product.files && product.files.length === 0) {
                product.files = await this.filesService.saveFiles(files, `${product.store.name}/${product.title}`);
            }
            else {
                const uploadedFiles = await this.filesService.saveFiles(files, `${product.store.name}/${product.title}`);
                product.files = [];
                product.files.push(...uploadedFiles);
            }
        }
        return product.save();
    }
    async updateProduct(updateProductDto) {
        let product = await this.findOne(updateProductDto.product_id, {
            store: true,
            files: true,
        });
        if (!product) {
            throw new common_1.NotFoundException("The product_id sent doesn't matches any product on the database.");
        }
        if (updateProductDto.toBeDeleted) {
            await this.filesService.removeFiles(updateProductDto.toBeDeleted);
            product = await this.findOne(updateProductDto.product_id, {
                store: true,
                files: true,
            });
        }
        if (product.files.length + updateProductDto.files.length > 3)
            throw new common_1.HttpException('Product can only have 3 images', common_1.HttpStatus.BAD_REQUEST);
        if (updateProductDto.categoriesIds) {
            product.categories = await this.categoriesService.findAllByIds(updateProductDto.categoriesIds);
            updateProductDto = _.omit(updateProductDto, 'categoriesIds');
        }
        if (updateProductDto.files) {
            if (product.files) {
                const uploadedFiles = await this.filesService.saveFiles(updateProductDto.files, `${product.store.name}/${product.title}`);
                uploadedFiles.forEach((f) => {
                    product.files.push(f);
                });
            }
            else {
                const uploadedFiles = await this.filesService.saveFiles(updateProductDto.files, `${product.store.name}/${product.title}`);
                product.files = [];
                product.files.push(...uploadedFiles);
            }
            updateProductDto = _.omit(updateProductDto, [
                'files',
                'product_id',
                'toBeDeleted',
            ]);
        }
        await product.save();
        return this.productRepository.update({ id: product.id }, updateProductDto);
    }
    async remove(id) {
        return this.productRepository.softDelete(id);
    }
    async findWithDiscount(findPromotedDto) {
        const parsedTake = findPromotedDto.take || 10;
        const parsedPage = findPromotedDto.page || 1;
        const parsedSkip = (parsedPage - 1) * parsedTake;
        const products = await this.productRepository.findAndCount({
            where: {
                discount: (0, typeorm_2.MoreThan)(0),
            },
            take: parsedTake,
            skip: parsedSkip,
            relations: ['files', 'store'],
            order: { discount: 'DESC' },
        });
        return paginateResponse(products, parsedPage, parsedSkip);
    }
    async findRelatedMarketplace({ categoryId, productName, storeId, take, page, }) {
        const parsedTake = take || 10;
        const parsedPage = page || 1;
        const parsedSkip = (parsedPage - 1) * parsedTake;
        const products = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.categories', 'categories')
            .leftJoinAndSelect('product.files', 'files')
            .where('categories.id = :id', { id: categoryId })
            .orWhere('product.title LIKE :title', { title: `%${productName}%` })
            .take(parsedTake)
            .skip(parsedSkip)
            .getManyAndCount();
        return paginateResponse(products, parsedPage, parsedSkip);
    }
    async findRelatedCatalog({ categoryId, productName, storeId, take, page, }) {
        const parsedTake = take || 10;
        const parsedPage = page || 1;
        const parsedSkip = (parsedPage - 1) * parsedTake;
        const products = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.categories', 'categories')
            .leftJoinAndSelect('product.files', 'files')
            .leftJoinAndSelect('product.store', 'store')
            .where('categories.id = :id', { id: categoryId })
            .andWhere('product.store_id = :storeId', { storeId })
            .take(parsedTake)
            .skip(parsedSkip)
            .getManyAndCount();
        return paginateResponse(products, parsedPage, parsedSkip);
    }
    async findFromCategory(categoryId, { take, page, }) {
        const parsedTake = take || 10;
        const parsedPage = page || 1;
        const parsedSkip = (parsedPage - 1) * parsedTake;
        const products = await this.productRepository
            .createQueryBuilder('product')
            .innerJoinAndSelect('product.categories', 'categories')
            .leftJoinAndSelect('product.files', 'files')
            .where('categories.id = :category', {
            category: categoryId,
        })
            .take(parsedTake)
            .skip(parsedSkip)
            .getManyAndCount();
        return paginateResponse(products, parsedPage, parsedSkip);
    }
    async productsSold(storeId, startDate, endDate, limit, offset) {
        return this.productRepository
            .createQueryBuilder('product')
            .innerJoinAndSelect('product.orderHistorics', 'historic')
            .leftJoin('product.files', 'files')
            .select('product')
            .addSelect('json_agg(files)', 'files')
            .addSelect('sum(historic.productQtd)', 'qtd')
            .where('product.store_id = :id', { id: storeId })
            .andWhere('product.sumOrders > 0')
            .andWhere(`historic.createdAt
          BETWEEN :begin
          AND :end`, { begin: startDate, end: endDate })
            .skip(offset)
            .take(limit)
            .groupBy('product.id')
            .getRawMany();
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => stores_service_1.StoresService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        fileStorage_provider_1.FileStorageProvider,
        stores_service_1.StoresService,
        categories_service_1.CategoriesService,
        users_service_1.UsersService])
], ProductsService);
exports.ProductsService = ProductsService;
function paginateResponse(data, page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    const [result, total] = data;
    const calculatedLastPage = Math.ceil(total / limit);
    const lastPage = calculatedLastPage === Infinity ? page : calculatedLastPage;
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        statusCode: 'success',
        data: [...result],
        count: total,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
    };
}
exports.paginateResponse = paginateResponse;
//# sourceMappingURL=products.service.js.map