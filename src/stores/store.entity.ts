import { Coupon } from './../coupons/entities/coupon.entity';
import { ScheduleProperties } from './types/scheduleProperties.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/product.entity';
import { File as Files } from 'src/files/file.entity';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Order } from 'src/orders/order.entity';
import { defaultSchedules } from './dto/create-store.dto';
import AWS from 'aws-sdk';

@Entity('store')
@Unique(['name'])
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  name: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 45,
    name: 'formated_name',
  })
  formatedName: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  CNPJ: string;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  phone: string;

  @Column({ nullable: true, type: 'varchar', length: 256 })
  address?: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  city: string;

  @Column({ nullable: false, type: 'varchar', length: 45 })
  state: string;

  @Column({ nullable: true, type: 'varchar', length: 256 })
  description?: string;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @Column({ nullable: true, default: 0, name: 'sum_orders' })
  sumOrders?: number;

  @Column({ nullable: true, default: 0, name: 'sum_feedbacks' })
  sumFeedbacks?: number;

  @Column({ nullable: true, default: 0, name: 'sum_stars' })
  sumStars?: number;

  @Column({ nullable: true, default: 0, name: 'avg_stars', type: 'float' })
  avgStars?: number;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 45,
    name: 'facebook_link',
  })
  facebookLink: string;

  instagram_link: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 45,
    name: 'whatsapp_link',
  })
  whatsappLink: string;

  @Column({ nullable: true, type: 'jsonb', default: defaultSchedules })
  schedules: ScheduleProperties;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product: Product) => product.store)
  products: Product[];

  @OneToOne(() => Files)
  @JoinColumn()
  avatar: Files;

  @OneToOne(() => Files)
  @JoinColumn()
  background: Files;

  @OneToMany(() => Files, (file) => file.user)
  files: Files[];

  @ManyToMany(() => Category, (category) => category.store)
  @JoinTable({ name: 'store_category' })
  categories: Category[];

  @OneToMany(() => Category, (category) => category.storeProducts)
  productCategories: Category[];

  @OneToMany(() => User, (user: User) => user.store)
  owners: User[];

  @OneToMany(() => Coupon, (coupon) => coupon.store)
  coupons: Coupon[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'favorites' })
  usersWhoLiked: User[];

  @Column({ nullable: false, default: 0 })
  likes: number;

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];
}
