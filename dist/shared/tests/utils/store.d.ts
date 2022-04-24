import { Store } from "src/stores/store.entity";
export default class StoreUtils {
    static giveMeAValidStore(id: string, phone: string, paymentMethods?: string[], name?: string): Store;
}
