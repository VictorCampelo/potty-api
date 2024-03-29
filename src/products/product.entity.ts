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
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { File } from 'src/files/file.entity';
import { Category } from 'src/categories/category.entity';
import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
@Entity('product')
@Unique(['id', 'title'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: true, type: 'varchar', length: 800 })
  description?: string;

  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @Column({ nullable: false, type: 'float', default: 0 })
  price: number;

  @Column({ nullable: true, type: 'float' })
  priceWithDiscount: number;

  @Column({ nullable: true, type: 'float' })
  discount: number;

  @Column({ nullable: true, default: 0 })
  sumOrders?: number;

  @Column({ nullable: true, default: 0 })
  sumFeedbacks?: number;

  @Column({ nullable: true, default: 0 })
  sumStars?: number;

  @Column({ nullable: true, default: 0, type: 'float' })
  avgStars?: number;

  @Column({ nullable: false, default: 0 })
  inventory: number;

  @Column({ nullable: true, type: 'timestamptz' })
  lastSold?: Date;

  @Column({ nullable: true, default: 1 })
  parcelAmount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Store, (store: Store) => store.products)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'varchar', nullable: true, name: 'store_id' })
  storeId: string;

  @OneToMany(() => File, (file) => file.product)
  files: File[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'products_categories' })
  categories: Category[];

  @OneToMany(() => Feedback, (feedback) => feedback.product)
  feedbacks: Feedback[];

  @OneToMany(() => OrderHistoric, (orderHistoric) => orderHistoric.product)
  orderHistorics: OrderHistoric[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateDiscount() {
    let value = this.price * (this.discount / 100 - 1);
    this.priceWithDiscount =
      value > 0
        ? parseFloat(value.toFixed(2))
        : parseFloat((value * -1).toFixed(2));
  }
}
