import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.TYPEORM_CONNECTION as any,
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [(__dirname + process.env.TYPEORM_ENTITIES_OPTIONS) as any],
  authSource: process.env.DB_AUTH || 'admin',
  synchronize: true,
  migrations: [__dirname + '/migration/*.ts'],
  cli: {
    //entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
    migrationsDir: __dirname + '/migration/',
  },
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  }
};
