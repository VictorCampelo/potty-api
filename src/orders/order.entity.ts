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
} from 'typeorm';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  orderHash: string;

  @ManyToOne(() => User, (user) => user.order)
  user: User;
  userId: string;

  @ManyToOne(() => Product)
  product: Product;
  productId: string;

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
