import { Product } from 'src/products/product.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
} from 'typeorm';
import { Order } from 'src/orders/order.entity';

@Entity('order_historic')
export class OrderHistoric extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId!: string;

  @Column({ nullable: false })
  storeId!: string;

  @Column()
  productId!: string;

  @Column({ nullable: false })
  productQtd: number;

  @Column({ nullable: false, type: 'float' })
  productPrice: number;

  @Column({ nullable: true, type: 'int' })
  productParcels: number;

  @Column({ nullable: false })
  customerId: string;

  @ManyToOne(() => Order, (order) => order.orderHistorics)
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderHistorics)
  product!: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
