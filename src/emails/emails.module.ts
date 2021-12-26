import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from 'src/configs/mailer.config';
import { EmailsService } from './emails.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
