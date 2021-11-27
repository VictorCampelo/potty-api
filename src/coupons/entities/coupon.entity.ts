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

@Entity('coupon')
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ nullable: false, unique: true, type: 'float' })
  discountPorcent: number;
  
  @Column({ nullable: false })
  maxUsage: number;
  
  @Column({ nullable: false, default: false })
  isExpired: boolean;
  
  @Column({ nullable: true, type: 'timestamptz' })
  validate: Date;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
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
