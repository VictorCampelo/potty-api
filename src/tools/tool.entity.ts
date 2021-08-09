import { User } from 'src/users/user.entity';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('tool')
@Unique(['id', 'title'])
export class Tool extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  description: string;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //@ManyToOne(() => User, (author: User) => author.posts)
  //@Exclude()
  //public owner: User;
}
