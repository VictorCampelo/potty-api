import { Feedback } from './../feedback/entities/feedback.entity';
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
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { File } from 'src/files/file.entity';
import { Order } from 'src/orders/order.entity';
import { Store } from 'src/stores/store.entity';

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

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

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
  public order!: Order[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
  static feedbacks: any;

  @Column({ nullable: true, type: 'varchar' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.users)
  store: Store;

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
