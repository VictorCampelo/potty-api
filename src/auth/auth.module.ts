import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { EmailsModule } from 'src/emails/emails.module';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'super-secret',
      signOptions: {
        expiresIn: 18000,
      },
    }),
    EmailsModule,
    StoresModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  //PassportModule: responsável por adicionar a funcionalidade de proteger um endpoint de usuários não autenticados.
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
