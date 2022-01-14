import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './store.entity';
import * as _ from 'lodash';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor() {
    super();
  }
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const storeNameAlreadyExists = await this.findOne({
      where: {
        name: createStoreDto.name,
      },
    });

    if (storeNameAlreadyExists) {
      throw new HttpException(
        'Já existe uma Loja com esse nome',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createStore = _.omit(createStoreDto, 'files');

    return this.create(createStore);
  }

  async addLike(user: User, store: Store): Promise<Store> {
    const updatedStore = this.create();
    Object.assign(updatedStore, store);

    if (!updatedStore.usersWhoLiked) {
      updatedStore.usersWhoLiked = [user];
      updatedStore.likes++;
      await updatedStore.save();

      return updatedStore;
    }

    const previousUsers = updatedStore.usersWhoLiked;
    previousUsers.push(user);

    updatedStore.likes++;
    updatedStore.usersWhoLiked = previousUsers;

    await updatedStore.save();

    return updatedStore;
  }
}
