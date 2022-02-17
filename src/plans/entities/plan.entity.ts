import { User } from 'src/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => User, (user) => user.plan)
  users: User[];

  @Column({ nullable: true })
  qtd_products: number;
}
