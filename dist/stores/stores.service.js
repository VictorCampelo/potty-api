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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const fileStorage_provider_1 = require("./../files/providers/fileStorage.provider");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const store_entity_1 = require("./store.entity");
const stores_repository_1 = require("./stores.repository");
const _ = __importStar(require("lodash"));
const categories_service_1 = require("../categories/categories.service");
const typeorm_2 = require("typeorm");
const payments_service_1 = require("../payments/payments.service");
let StoresService = class StoresService {
    constructor(storeRepository, usersService, filesService, categoriesService, paymentsService) {
        this.storeRepository = storeRepository;
        this.usersService = usersService;
        this.filesService = filesService;
        this.categoriesService = categoriesService;
        this.paymentsService = paymentsService;
    }
    async create(createStoreDto, userId) {
        let user;
        if (userId) {
            user = await this.usersService.findUserById(userId);
            if (!user || user.role !== 'OWNER' || user.storeId) {
                throw new common_1.HttpException('User is not valid', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!/^[A-Za-z0-9_-]+$/g.test(createStoreDto.name.replace(/ /g, '-'))) {
                throw new common_1.HttpException('Nome da Loja contém caracteres inválidos', common_1.HttpStatus.BAD_REQUEST);
            }
            createStoreDto['formatedName'] = createStoreDto.name
                .replace(/ /g, '-')
                .toLowerCase();
        }
        const store = await this.storeRepository.createStore(createStoreDto);
        const storeNameAlreadyExists = await this.storeRepository.findOne({
            where: {
                formatedName: store.formatedName,
            },
        });
        if (storeNameAlreadyExists) {
            throw new common_1.HttpException('Já existe uma Loja com esse nome', common_1.HttpStatus.BAD_REQUEST);
        }
        if (createStoreDto.avatar) {
            const avatar = await this.filesService.saveFiles([createStoreDto.avatar], store.name);
            store.avatar = avatar[0];
        }
        if (user) {
            await store.save();
            user.store = store;
            user.storeId = store.id;
            await user.save();
            return store;
        }
        return store;
    }
    async save(store) {
        return this.storeRepository.save(store);
    }
    async saveAll(stores) {
        return this.storeRepository.save(stores);
    }
    async findAll() {
        return this.storeRepository.find({
            join: {
                alias: 'store',
                leftJoinAndSelect: {
                    user: 'store.avatar',
                    background: 'store.background',
                },
            },
        });
    }
    async findAllByIds(ids) {
        return this.storeRepository.findByIds(ids, {
            relations: ['paymentMethods'],
        });
    }
    async findOne(id) {
        const store = await this.storeRepository.findOne(id, {
            join: {
                alias: 'store',
                leftJoinAndSelect: {
                    user: 'store.avatar',
                    background: 'store.background',
                    categories: 'store.categories',
                    paymentMethods: 'store.paymentMethods',
                },
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async findOneByUser(userId) {
        const store = await this.usersService.myStore(userId);
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async findStoreMe(owner_id) {
        const user = await this.usersService.findUserMe(owner_id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findOneByName(formatedName) {
        const store = await this.storeRepository.findOne({
            where: { formatedName: formatedName },
            join: {
                alias: 'store',
                leftJoinAndSelect: {
                    user: 'store.avatar',
                    background: 'store.background',
                },
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async update(id, updateStoreDto, files) {
        if (updateStoreDto.schedules) {
            const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
            for (const day in updateStoreDto.schedules) {
                if (!days.includes(day))
                    throw new common_1.HttpException(`Invalid day: ${day}. Try seg, ter, qua, qui, sex, sab or dom.`, common_1.HttpStatus.BAD_REQUEST);
                if (updateStoreDto.schedules[day]) {
                    if (!/^[0-9]{2}:[0-9]{2}$/g.test(updateStoreDto.schedules[day][0]) ||
                        !/^[0-9]{2}:[0-9]{2}$/g.test(updateStoreDto.schedules[day][1]))
                        throw new common_1.HttpException(`Invalid schedule format: ${updateStoreDto.schedules[day]} at day '${day}'`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
        }
        if (updateStoreDto.dispatch) {
            if (!/^withdrawal$|^delivery$|^all$/g.test(updateStoreDto.dispatch))
                throw new common_1.HttpException(`Invalid dispatch. Try withdrawal, delivery or all.`, common_1.HttpStatus.BAD_REQUEST);
        }
        const storeCheck = await this.storeRepository.findOne({
            where: { formatedName: updateStoreDto.formatedName },
        });
        if (storeCheck) {
            throw new common_1.HttpException('Store URL name already taken', common_1.HttpStatus.BAD_GATEWAY);
        }
        const store = await this.findOne(id);
        if (updateStoreDto.paymentMethods && updateStoreDto.paymentMethods.length) {
            const lowerPms = updateStoreDto.paymentMethods.map((pm) => {
                return pm.toLowerCase();
            });
            const paymentsFound = await this.paymentsService.findByName(lowerPms);
            store.paymentMethods = paymentsFound;
            if (!paymentsFound.length) {
                throw new common_1.HttpException('Payment methods not found', common_1.HttpStatus.NOT_FOUND);
            }
            updateStoreDto = _.omit(updateStoreDto, 'paymentMethods');
        }
        if (updateStoreDto.name) {
            if (!/^[A-Za-z0-9_-]+$/g.test(updateStoreDto.name.replace(/ /g, '-'))) {
                throw new common_1.HttpException('Nome da Loja contém caracteres inválidos', common_1.HttpStatus.BAD_REQUEST);
            }
            updateStoreDto['formatedName'] = updateStoreDto.name
                .replace(/ /g, '-')
                .toLowerCase();
        }
        if (files && files[0]) {
            const avatar = await this.filesService.saveFiles([files[0]], store.name);
            store.avatar = avatar[0];
        }
        if (files && files[1]) {
            console.log(files);
            const background = await this.filesService.saveFiles([files[1]], store.name);
            store.background = background[0];
        }
        if (updateStoreDto.categoriesIds) {
            store.categories = await this.categoriesService.findAllByIdsTypeStore(updateStoreDto.categoriesIds);
        }
        updateStoreDto = _.omit(updateStoreDto, 'categoriesIds');
        Object.assign(store, updateStoreDto);
        return store.save();
    }
    remove(id) {
        return `This action removes a #${id} store`;
    }
    async addLike(user, name) {
        const store = await this.storeRepository.findOne({
            where: {
                formatedName: name,
            },
            relations: ['usersWhoLiked'],
        });
        if (!user || !store) {
            throw new common_1.NotFoundException('User or Store not found.');
        }
        store.usersWhoLiked.forEach((userInFavorites) => {
            if (userInFavorites.id === user.id) {
                throw new common_1.UnauthorizedException("User can't favorite the same store twice.");
            }
        });
        return this.storeRepository.addLike(user, store);
    }
    async findOnSearch(findStoreDto) {
        const productsFound = [];
        const storesFound = [];
        const searchResults = await (0, typeorm_2.getRepository)(store_entity_1.Store)
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.avatar', 'avatar')
            .leftJoinAndSelect('store.background', 'background')
            .leftJoinAndSelect('store.products', 'p')
            .leftJoinAndSelect('p.files', 'files')
            .leftJoinAndSelect('p.categories', 'pc')
            .leftJoinAndSelect('store.categories', 'sc')
            .leftJoinAndSelect('store.productCategories', 'c')
            .where('city ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .orWhere('store.name ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .orWhere('p.title ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .orWhere('p.description ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .orWhere('c.name ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .skip(findStoreDto.skip)
            .take(findStoreDto.take)
            .getMany();
        searchResults.forEach((result) => {
            const { products, ...store } = result;
            const prod = products.find((p) => p.storeId === store.id);
            if (prod) {
                prod['storeName'] = store.name;
                prod['storeFormatedName'] = store.formatedName;
                productsFound.push(prod);
                storesFound.push(store);
            }
        });
        return { productsFound, storesFound };
    }
    async findOnSearchProduct(storeId, findStoreDto) {
        const searchResults = await (0, typeorm_2.getRepository)(store_entity_1.Store)
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.avatar', 'avatar')
            .leftJoinAndSelect('store.background', 'background')
            .leftJoinAndSelect('store.products', 'p')
            .leftJoinAndSelect('p.files', 'files')
            .leftJoinAndSelect('p.categories', 'pc')
            .leftJoinAndSelect('store.categories', 'sc')
            .leftJoinAndSelect('store.productCategories', 'c')
            .where('store.id = :id', {
            id: storeId,
        })
            .andWhere('p.title ILIKE :parameter', {
            parameter: `%${findStoreDto.parameter}%`,
        })
            .skip(findStoreDto.skip)
            .take(findStoreDto.take)
            .getMany();
        let results = [];
        searchResults.forEach((result) => {
            const { products } = result;
            results.push(...products);
        });
        return results;
    }
    async findFromCategory(categoryId) {
        return this.storeRepository
            .createQueryBuilder('stores')
            .innerJoinAndSelect('stores.categories', 'categories')
            .leftJoinAndSelect('stores.avatar', 'avatar')
            .leftJoinAndSelect('stores.background', 'background')
            .where('categories.id = :category', {
            category: categoryId,
        })
            .getMany();
    }
};
StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stores_repository_1.StoreRepository)),
    __metadata("design:paramtypes", [stores_repository_1.StoreRepository,
        users_service_1.UsersService,
        fileStorage_provider_1.FileStorageProvider,
        categories_service_1.CategoriesService,
        payments_service_1.PaymentsService])
], StoresService);
exports.StoresService = StoresService;
//# sourceMappingURL=stores.service.js.map