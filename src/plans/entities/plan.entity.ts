import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('plan')
@Unique(['code'])
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: false, type: 'integer' })
  code: number;

  @Column({ nullable: false })
  price: number;

  @OneToMany(() => User, (user) => user.plan)
  users: User[];

  @Column({ nullable: true })
  qtd_products: number;
}
