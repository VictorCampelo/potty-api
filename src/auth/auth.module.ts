import { UsersModule } from './../users/users.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { EmailsModule } from 'src/emails/emails.module';
import { StoresModule } from 'src/stores/stores.module';
import { PlansModule } from 'src/plans/plans.module';
import { celebrate } from 'celebrate';
import { parseFormDataJsonInterceptor } from 'src/interceptors/parseFormData.interceptor';
import { createUserStoreValidation } from './validations/create-store.validation';
import { authStoreValidation } from './validations/auth-store.validation';
import { createUserValidation } from './validations/create-user.validation';
import { confirmaEmailValidation } from './validations/confirm-email.validation';
import { sendRecoverEmailValidation } from './validations/send-recover-email.validation';
import { resetPasswordValidation } from './validations/reset-password.validation';
import { changePasswordValidation } from './validations/change-password.validation';
import { changePlanValidation } from './validations/change-plan.validation';

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
    UsersModule,
    PlansModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        parseFormDataJsonInterceptor({ except: ['avatar'] }),
        celebrate(createUserStoreValidation),
      )
      .forRoutes('auth/signup-store');
    consumer.apply(celebrate(createUserValidation)).forRoutes('auth/signup');
    consumer.apply(celebrate(authStoreValidation)).forRoutes('auth/signin');
    consumer.apply(celebrate(confirmaEmailValidation)).forRoutes('auth/:token');
    consumer
      .apply(celebrate(sendRecoverEmailValidation))
      .forRoutes('auth/send-recover-email');
    consumer
      .apply(celebrate(resetPasswordValidation))
      .forRoutes('auth/reset-password/:token');

    consumer
      .apply(celebrate(changePasswordValidation))
      .forRoutes('auth/:id/change-password');

    consumer.apply(celebrate(changePlanValidation)).forRoutes('auth/plan');
  }
}
