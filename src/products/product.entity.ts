import { Store } from 'src/stores/store.entity';
import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { File as Files } from 'src/files/file.entity';

@Entity('product')
@Unique(['id', 'title'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  description: string;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Store, (store: Store) => store.products)
  store: Store;

  @OneToMany(() => Files, (file) => file.user)
  files: Files[];
}
