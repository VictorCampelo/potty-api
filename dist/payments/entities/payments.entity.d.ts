import { BaseEntity } from 'typeorm';
import { Store } from 'src/stores/store.entity';
import { File as Files } from 'src/files/file.entity';
export declare class Payment extends BaseEntity {
    id: string;
    methodName: string;
    allowParcels: boolean;
    logo: Files;
    store: Store[];
}
