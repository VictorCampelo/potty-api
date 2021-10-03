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

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
    private usersService: UsersService,
  ) {}

  async save(store: Store) {
    return await this.storeRepository.save(store);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    return await this.storeRepository.saveStore(createStoreDto);
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

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return await this.storeRepository.update(id, updateStoreDto);
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
