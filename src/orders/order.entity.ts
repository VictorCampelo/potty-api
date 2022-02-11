import { OrderHistoric } from './../order-historics/entities/order-historic.entity';
import { Coupon } from './../coupons/entities/coupon.entity';
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
  JoinColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, unique: true })
  orderNumber: string;

  @Column({ type: 'varchar', nullable: true, name: 'user_id' })
  userId: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders)
  coupon: Coupon;
  couponId: string;

  @OneToMany(() => OrderHistoric, (orderHistoric) => orderHistoric.order)
  orderHistorics: OrderHistoric[];

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'varchar', nullable: true, name: 'store_id' })
  storeId: string;

  @Column({ nullable: false, type: 'float' })
  amount: number;

  @Column({ nullable: false, default: false })
  status: boolean;

  @Column({ nullable: false, type: 'varchar', default: 'Recebido' })
  situation: 'Recebido' | 'Processando' | 'Concluído' | 'Cancelado';

  @Column({ nullable: true, default: false })
  requiresDelivery?: boolean;

  @Column({ type: 'varchar', nullable: true })
  customerAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateOrderNumber() {
    this.orderNumber = (Math.floor(Math.random() * 999999999) + 1).toString();

    if (this.orderNumber.length < 9) {
      this.orderNumber =
        '0'.repeat(9 - this.orderNumber.length) + this.orderNumber;
    }
  }
}
