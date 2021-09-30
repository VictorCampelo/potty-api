import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './store.entity';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor() {
    super();
  }
  async saveStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.create(createStoreDto);
    return await store.save();
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
