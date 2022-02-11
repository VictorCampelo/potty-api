import { Product } from 'src/products/product.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/orders/order.entity';

@Entity('order_historic')
export class OrderHistoric extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  storeId!: string;

  // @Column()
  // productId!: string;

  @Column({ nullable: false })
  productQtd: number;

  @Column({ nullable: false, type: 'float' })
  productPrice: number;

  @Column({ nullable: true, type: 'int' })
  productParcels: number;

  @Column({ nullable: false })
  customerId: string;

  @ManyToOne(() => Order, (order) => order.orderHistorics)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'varchar', nullable: false })
  orderId: string;

  @ManyToOne(() => Product, (product) => product.orderHistorics)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'varchar', nullable: false })
  productId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
