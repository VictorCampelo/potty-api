import { Store } from 'src/stores/store.entity';

export default class Util {
  static giveMeAValidStore(id: string): Store {
    const store = new Store();
    store.id = id;
    return store;
  }
}
