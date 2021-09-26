import { FindStoreDto } from './dto/find-store.dto';
import { ProductRepository } from './../products/products.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  create(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeRepository.createStoreAfterUser(createStoreDto);
  }

  findAll() {
    return this.storeRepository.find();
  }

  async findOne(findStoreDto: FindStoreDto) {
    const store = await this.storeRepository.findOne(findStoreDto.store_id);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (findStoreDto.loadProducts) {
      const products = await this.productsService.findAll(
        store.id,
        findStoreDto.loadProducts.limit,
        findStoreDto.loadProducts.offset,
      );
      return Object.assign(store, products);
    }

    return store;
  }

  async findMostSoldsProducts(findStoreDto: FindStoreDto) {
    if (findStoreDto.loadProducts) {
      const products = await this.productsService.findAll(
        findStoreDto.store_id,
        findStoreDto.loadProducts.limit,
        findStoreDto.loadProducts.offset,
      );
      return products;
    }
  }

  async findLastSoldProducts(findStoreDto: FindStoreDto) {
    if (findStoreDto.loadProducts) {
      const products = await this.productsService.findAll(
        findStoreDto.store_id,
        findStoreDto.loadProducts.limit,
        findStoreDto.loadProducts.offset,
      );
      return products;
    }
  }

  update(id: number, _updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async addLike(userId: string, storeId: string): Promise<Store> {
    const user = await this.usersService.findUserById(userId);
    const store = await this.storeRepository.findOne(storeId, {
      relations: ['usersWhoLiked', 'users'],
    });

    if (!user || !store) {
      throw new NotFoundException('User or Store not found.');
    }

    store.usersWhoLiked.forEach((userInFavorites) => {
      if (userInFavorites.id === user.id) {
        throw new UnauthorizedException(
          "User can't favorite the same store twice.",
        );
      }
    });

    return await this.storeRepository.addLike(user, store);
  }
}
