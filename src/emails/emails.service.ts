import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EmailsService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    emailTo: string,
    subject: string,
    template: string,
    body: any,
  ) {
    try {
      const mail = {
        to: emailTo,
        from: 'noreply@potty.com.br',
        subject: subject,
        template: `./public/templates/${template}.hbs`,
        context: body,
      };
      await this.mailerService.sendMail(mail);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // private loadTemplate(filename: string) {
  //   return fs.readFileSync(
  //     path.resolve(`./public/templates/${filename}.hbs`),
  //     'utf8',
  //   );
  // }
}
