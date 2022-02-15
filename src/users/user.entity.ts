import { Coupon } from './../coupons/entities/coupon.entity';
import { Feedback } from '../feedback/feedback.entity';
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { File } from 'src/files/file.entity';
import { Order } from 'src/orders/order.entity';
import { Store } from 'src/stores/store.entity';
import { Plan } from 'src/plans/entities/plan.entity';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  firstName: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  lastName: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, default: true }) //TODO por default o enable so virará true quando o email foir confirmado
  enabled: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string;

  @Column({ nullable: true, type: 'varchar', length: 6 })
  confirmationTokenDigits: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

  @Column({ nullable: true, type: 'varchar', length: 6 })
  recoverTokenDigits: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  hasAcceptedTerms: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => File, (file) => file.user, { cascade: true })
  files: File[];

  @OneToOne(() => File)
  @JoinColumn()
  profileImage: File;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @Column({ nullable: true, type: 'varchar' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.owners)
  store: Store;

  @ManyToMany(() => Store, (stores) => stores.usersWhoLiked)
  likedstores: Store[];

  @ManyToMany(() => Coupon, (coupon) => coupon.users)
  coupons: Coupon[];

  @Column({ nullable: true })
  zipcode?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  addressNumber?: number;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  uf?: string;

  @Column({ nullable: true })
  logradouro?: string;

  @ManyToOne(() => Plan, (plan: Plan) => plan.users)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'varchar', nullable: true, name: 'plan_id' })
  planId: string;

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
