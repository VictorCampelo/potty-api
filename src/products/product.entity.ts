import { Feedback } from '../feedback/feedback.entity';
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
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { File } from 'src/files/file.entity';
import { Order } from 'src/orders/order.entity';
@Entity('product')
@Unique(['id', 'title'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  description?: string;

  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column({ nullable: true, default: 0 })
  sumOrders?: number;

  @Column({ nullable: true, default: 0 })
  sumFeedbacks?: number;

  @Column({ nullable: true, default: 0 })
  sumStars?: number;

  @Column({ nullable: true, default: 0 })
  avgStars?: number;

  @Column({ nullable: true, type: 'timestamptz' })
  lastSold?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Store, (store: Store) => store.products)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => File, (file) => file.product)
  files: File[];

  @OneToMany(() => Feedback, (feedback) => feedback.product)
  feedbacks: Feedback[];

  @OneToMany(() => Order, (orders) => orders.product)
  orders: Order[];
}
