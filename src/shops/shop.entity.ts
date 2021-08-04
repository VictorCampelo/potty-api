import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "src/products/product.entity";

@Entity('shop')
export class Shop {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    name: string;

    @Column({ nullable: true, type: 'varchar', length: 45 })
    CNPJ: string;

    @Column({ nullable: true, type: 'varchar', length: 45 })
    phone: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    address: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    city: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    state: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    description: string;

    @Column({ nullable: false })
    enabled: boolean;

    @Column({ nullable: true, type: 'varchar', length: 45 })
    facebook_link: string;

    @Column({ nullable: true, type: 'varchar', length: 45 })
    instagram_link: string;

    @Column({ nullable: true, type: 'varchar', length: 45 })
    whatsapp_link: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product: Product) => product.shop)
    products: Product[];

}
