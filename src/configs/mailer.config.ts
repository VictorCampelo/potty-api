import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as dotenv from 'dotenv';

dotenv.config();

export const mailerConfig: MailerOptions = {
  template: {
    dir: process.cwd() + '/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: process.cwd() + '/templates',
    },
  },
  transport: {
    host: process.env.HOST_MAIL,
    port: parseInt(process.env.PORT_MAIL),
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  },
  defaults: {
    from: '"nest-modules" <modules@nestjs.com>',
  },
};
