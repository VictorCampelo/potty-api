/// <reference types="multer" />
import { User } from 'src/users/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoreDto } from './dto/find-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    findAll(): Promise<import("./store.entity").Store[]>;
    findOneById(id: string): Promise<import("./store.entity").Store>;
    getStoreMe(user: User): Promise<User>;
    findByCategory(catId: string): Promise<import("./store.entity").Store[]>;
    findOneByName(name: string): Promise<import("./store.entity").Store>;
    update(user: User, updateStoreDto: {
        storeDto: UpdateStoreDto;
    }, { avatar, background, }: {
        avatar: Express.Multer.File;
        background: Express.Multer.File;
    }): Promise<import("./store.entity").Store>;
    remove(id: string): Promise<string>;
    addLikeToStore(name: string, user: User): Promise<{
        store: import("./store.entity").Store;
        message: string;
    }>;
    findOnSearch(query: FindStoreDto): Promise<{
        productsFound: any[];
        storesFound: any[];
    }>;
    findOnSearchProducts(storeId: string, query: FindStoreDto): Promise<any[]>;
    createStore(storeAvatar: Express.Multer.File, createStore: CreateStoreDto, user: User): Promise<import("./store.entity").Store>;
}
