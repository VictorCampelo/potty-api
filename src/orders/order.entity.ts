import { OrderHistoric } from './../order-historics/entities/order-historic.entity';
import { Coupon } from './../coupons/entities/coupon.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.order)
  user: User;
  userId: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders)
  coupon: Coupon;
  couponId: string;

  @OneToMany(() => OrderHistoric, orderHistoric => orderHistoric.order)
  orderHistorics: OrderHistoric[];

  @ManyToOne(() => Store)
  store: Store;
  storeId: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, default: false })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
