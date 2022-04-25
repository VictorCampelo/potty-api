import { TypeOrmModuleOptions } from '@nestjs/typeorm';
declare class ConfigService {
    private env;
    constructor(env: {
        [k: string]: string | undefined;
    });
    getValue(key: string, throwOnMissing?: boolean): string;
    ensureValues(keys: string[]): this;
    getPort(): string;
    isProduction(): boolean;
    getTypeOrmConfig(): TypeOrmModuleOptions;
}
declare const configService: ConfigService;
export { configService };
