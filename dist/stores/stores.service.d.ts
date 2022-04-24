/// <reference types="multer" />
import { FilesService } from './../files/files.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';
import { CategoriesService } from 'src/categories/categories.service';
import { FindStoreDto } from './dto/find-store.dto';
import { PaymentsService } from 'src/payments/payments.service';
export declare class StoresService {
    private storeRepository;
    private usersService;
    private filesService;
    private categoriesService;
    private paymentsService;
    constructor(storeRepository: StoreRepository, usersService: UsersService, filesService: FilesService, categoriesService: CategoriesService, paymentsService: PaymentsService);
    create(createStoreDto: CreateStoreDto, userId?: string): Promise<Store>;
    save(store: Store): Promise<Store>;
    saveAll(stores: Store[]): Promise<Store[]>;
    findAll(): Promise<Store[]>;
    findAllByIds(ids: string[]): Promise<Store[]>;
    findOne(id: string): Promise<Store>;
    findOneByUser(userId: string): Promise<Store>;
    findStoreMe(owner_id: string): Promise<User>;
    findOneByName(formatedName: string): Promise<Store>;
    update(id: string, updateStoreDto: UpdateStoreDto, files: Express.Multer.File[]): Promise<Store>;
    remove(id: number): string;
    addLike(user: User, name: string): Promise<Store>;
    findOnSearch(findStoreDto: FindStoreDto): Promise<{
        productsFound: any[];
        storesFound: any[];
    }>;
    findOnSearchProduct(storeId: string, findStoreDto: FindStoreDto): Promise<any[]>;
    findFromCategory(categoryId: string): Promise<Store[]>;
}
