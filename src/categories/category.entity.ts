import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/product.entity';
import { Store } from 'src/stores/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  //store or product
  @Column({ nullable: false, type: 'varchar', length: 50, default: 'product' })
  type: string;

  @ManyToMany(() => Store, (store) => store.categories)
  store: Store[];

  @ManyToOne(() => Store, (store) => store.productCategories)
  @JoinColumn({ name: 'store_products_id' })
  storeProducts: Store;

  @Column({ type: 'varchar', nullable: true, name: 'store_products_id' })
  storeProductsId: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @ManyToOne(() => Coupon, (coupon) => coupon.categories)
  coupon: Coupon;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
