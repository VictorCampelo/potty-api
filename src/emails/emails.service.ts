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
        from: 'noreply@application.com',
        subject: subject,
        template: this.loadTemplate(template),
        context: body,
      };
      await this.mailerService.sendMail(mail);
    } catch (error) {
      console.error(error);
    }
  }

  private loadTemplate(filename: string) {
    return fs.readFileSync(
      path.resolve(`public/templates/${filename}.hbs`),
      'utf8',
    );
  }
}
