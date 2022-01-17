import { Store } from 'src/stores/store.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('file')
@Unique(['url', 'hash', 'filename'])
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 500 })
  filename: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  alternativeText: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  url: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  previewUrl: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  provider: string;

  @Column({ nullable: true, type: 'jsonb' })
  providerMetadata: any;

  @Column({ nullable: false, type: 'varchar' })
  ext: string;

  @Column({ nullable: true, type: 'int4' })
  createdBy: number;

  @Column({ nullable: true, type: 'int4' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.files)
  product: Product;

  @ManyToOne(() => Store, (store) => store.files)
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export type FileAttributes = Omit<
  File,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
