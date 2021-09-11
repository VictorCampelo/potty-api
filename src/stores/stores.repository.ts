import { User } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './store.entity';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  async createStoreAfterUser(createStoreDto: CreateStoreDto): Promise<Store> {
    const {
      user,
      business_name,
      CNPJ,
      phone,
      address,
      city,
      state,
      description,
      facebook_link,
      instagram_link,
      whatsapp_link,
    } = createStoreDto;

    const store = this.create();

    store.users = [user];

    store.name = business_name;
    store.CNPJ = CNPJ;
    store.phone = phone;
    store.address = address;
    store.city = city;
    store.state = state;
    store.description = description;
    store.facebook_link = facebook_link;
    store.instagram_link = instagram_link;
    store.whatsapp_link = whatsapp_link;

    await store.save();

    return store;
  }

  async addLike(user: User, store: Store): Promise<Store> {
    const updateStore = this.create();
    Object.assign(updateStore, store);

    updateStore.usersWhoLiked = [user];
    user.favoriteStores = [store];

    updateStore.likes++;

    await user.save();
    await updateStore.save();

    return updateStore;
  }
}
