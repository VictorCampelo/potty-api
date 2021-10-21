import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './store.entity';
import * as _ from 'lodash';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor() {
    super();
  }
  createStore(createStoreDto: CreateStoreDto): Store {
    const createStore = _.omit(createStoreDto, 'files');
    const store = this.create(createStore);
    return store;
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
