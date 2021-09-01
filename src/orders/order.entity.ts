import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  public orderid!: number;

  @ManyToOne(() => User, (user) => user.order)
  public user!: User;

  @ManyToOne(() => Product, (product) => product.order)
  public product!: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
