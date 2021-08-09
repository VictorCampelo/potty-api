import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('upload_file')
@Unique(['id', 'url', 'hash'])
export class UploadFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  alternativeText: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  caption: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  hash: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  ext: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  mime: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  provider: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  url: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  previewUrl: string;

  @Column({ nullable: true, type: 'int4' })
  width: number;

  @Column({ nullable: true, type: 'int4' })
  height: number;

  @Column({ nullable: true, type: 'int4' })
  createdBy: number;

  @Column({ nullable: true, type: 'int4' })
  updatedBy: number;

  @Column({ nullable: true, type: 'jsonb' })
  formats: any;

  @Column({ nullable: true, type: 'jsonb' })
  providerMetadata: any;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
