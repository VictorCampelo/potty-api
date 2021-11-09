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
  @Column({ nullable: false, type: 'varchar', length: 20, default: 'product' })
  type: string;

  @ManyToMany(() => Store, (store) => store.categories)
  store: Store[];

  @ManyToOne(() => Store, (store) => store.productCategories)
  storeProducts: Store;
  storeProductsId: string;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable({name: "productsCategories"})
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
