import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailsService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendEmail(emailTo: string, subject: string, template: string, body: any): Promise<boolean>;
}
