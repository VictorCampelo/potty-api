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
    return this.storeRepository.save(store);
  }

  async saveAll(stores: Store[]) {
    return this.storeRepository.save(stores);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.createStore(createStoreDto);

    return store.save();
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

  async findOneByUser(userId: string) {
    const store = await this.usersService.myStore(userId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async findStoreMe(owner_id: string) {
    const user = await this.usersService.findUserMe(owner_id);

    // const store = await this.storeRepository.findOne(user.store.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByName(formatedName: string) {
    const store = await this.storeRepository.findOne({
      where: { formatedName: formatedName },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto, files) {
    const store = await this.findOne(id);
    if (files && files[0]) {
      store.avatar = await this.filesService.create(files[0]);
    }
    if (files && files[1]) {
      store.background = await this.filesService.create(files[1]);
    }
    if (updateStoreDto.categoriesIds) {
      store.categories = await this.categoriesService.findAllByIdsTypeStore(
        updateStoreDto.categoriesIds,
      );
    }
    updateStoreDto = _.omit(updateStoreDto, 'categoriesIds');

    for (const props in updateStoreDto) {
      store[props] = updateStoreDto[props];
    }

    return store.save();
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async addLike(user: User, name: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        formatedName: name,
      },
      relations: ['usersWhoLiked'],
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

    return this.storeRepository.addLike(user, store);
  }
}
