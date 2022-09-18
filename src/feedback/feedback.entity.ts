import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

@Entity('feedback')
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  orderId: string;

  @Column({ nullable: false, default: 0 })
  star: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;

  @ManyToOne(() => Product, (product) => product.feedbacks)
  product: Product;

  // @OneToMany(() => File, (file) => file.product)
  // files: File[];
}
