import { FilesService } from './../files/files.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';
import * as _ from 'lodash';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
    private usersService: UsersService,
    private filesService: FilesService,
    private categoriesService: CategoriesService,
  ) {}

  async save(store: Store) {
    return await this.storeRepository.save(store);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.createStore(createStoreDto);

    return await store.save();
  }

  findAll() {
    return this.storeRepository.find();
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOne(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto, files) {
    const updateStore = _.omit(updateStoreDto, 'files');
    if (files && files[0]) {
      updateStoreDto.avatar = await this.filesService.create(files[0]);
    }
    if (files && files[1]) {
      updateStoreDto.background = await this.filesService.create(files[1]);
    }
    if (updateStoreDto.categoryId) {
      const category = await this.categoriesService.findOne(
        updateStoreDto.categoryId,
      );
      updateStoreDto = _.omit(updateStoreDto, 'categoryId');
      updateStoreDto['category'] = category;
    }
    return await this.storeRepository.update(id, updateStore);
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async addLike(user: User, storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne(storeId, {
      relations: ['usersWhoLiked', 'users'],
    });

    console.log(store);

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
