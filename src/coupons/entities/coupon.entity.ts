import { Store } from './../../stores/store.entity';
import { Order } from './../../orders/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';

@Entity('coupon')
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: true, type: 'varchar' })
  type: 'money' | 'percentage';

  @Column({ nullable: true, type: 'varchar' })
  range: 'category' | 'store' | 'first-buy';

  @Column({ nullable: false, type: 'float', default: 0 })
  discountPorcent: number;

  @Column({ nullable: false, type: 'float', default: 0 })
  discountValue: number;

  @Column({ nullable: false })
  maxUsage: number;

  @Column({ nullable: false, default: false })
  isExpired: boolean;

  @Column({ nullable: false, default: false })
  isPrivate: boolean;

  @Column({ nullable: false, default: false })
  isLimited: boolean;

  @Column({ nullable: true })
  validate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.coupon)
  categories: Category[];

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Order[];

  @ManyToOne(() => Store, (store) => store.coupons)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'varchar', nullable: true, name: 'store_id' })
  storeId: string;

  @ManyToMany(() => User, (user) => user.coupons)
  @JoinTable({ name: 'user_coupons_used' })
  users: User[];
}
