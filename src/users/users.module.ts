import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FilesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
