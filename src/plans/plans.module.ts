import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { EmailsModule } from 'src/emails/emails.module';
import { BuyerhistoryModule } from 'src/buyerhistory/buyerhistory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    EmailsModule,
    BuyerhistoryModule,
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
