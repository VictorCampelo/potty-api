import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Store } from 'src/stores/store.entity';
import { File as Files } from 'src/files/file.entity';

@Entity('payment')
@Unique(['methodName'])
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  methodName: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  allowParcels: boolean;

  @OneToOne(() => Files)
  @JoinColumn()
  logo: Files;

  @ManyToMany(() => Store, (store) => store.paymentMethods)
  store: Store[];
}
