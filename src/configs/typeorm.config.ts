import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode != 'dev';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('TYPEORM_HOST'),
      port: parseInt(this.getValue('TYPEORM_PORT')),
      username: this.getValue('TYPEORM_USERNAME'),
      password: this.getValue('TYPEORM_PASSWORD'),
      database: this.getValue('TYPEORM_DATABASE'),
      synchronize: true,
      entities: [
        (__dirname + this.getValue('TYPEORM_ENTITIES_OPTIONS')) as any,
      ],
      migrationsTableName: 'migration',
      migrations: [__dirname + '/migration/*.ts'],
      cli: {
        //entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
        migrationsDir: __dirname + '/migration/',
      },
      ssl: this.isProduction(),
      extra: {
        max: 100, // set pool max size to 20
        idleTimeoutMillis: 1000 * 60, // close idle clients after 1 second
        connectionTimeoutMillis: 15000, // return an error after 1 second if connection could not be established
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'TYPEORM_HOST',
  'TYPEORM_PORT',
  'TYPEORM_USERNAME',
  'TYPEORM_PASSWORD',
  'TYPEORM_DATABASE',
]);

export { configService };
