import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/product.entity';
import { File as Files } from 'src/files/file.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Entity('store')
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  CNPJ: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  phone: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  address: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  city: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  state: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  description: string;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @Column({ nullable: true, default: 0 })
  sumOrders?: number;

  @Column({ nullable: true, default: 0 })
  sumFeedbacks?: number;

  @Column({ nullable: true, default: 0 })
  sumStars?: number;

  @Column({ nullable: true, default: 0 })
  avgStars?: number;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  facebook_link: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  instagram_link: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  whatsapp_link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product: Product) => product.store)
  products: Product[];

  @OneToMany(() => Files, (file) => file.user)
  files: Files[];

  @ManyToMany(() => Category, (category) => category.store)
  @JoinTable({ name: 'store_category' })
  categories: Category[];

  @OneToMany(() => User, (user: User) => user.store)
  owners: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'favorites' })
  usersWhoLiked: User[];

  @Column({ nullable: false, default: 0 })
  likes: number;
}
