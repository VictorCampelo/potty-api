import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './store.entity';
export declare class StoreRepository extends Repository<Store> {
    constructor();
    createStore(createStoreDto: CreateStoreDto): Promise<Store>;
    addLike(user: User, store: Store): Promise<Store>;
}
