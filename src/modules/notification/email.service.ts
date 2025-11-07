import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private EMAIl = 'testnodemailer001@mail.ru';
  constructor(private emailService: MailerService) {}
  async sendConfirmationEmail(email: string, code: string) {
    try {
      await this.emailService.sendMail({
        from: `"My App" ${this.EMAIl}`,
        to: email,
        subject: 'Email Confirmation',
        template: 'confirm',
        context: {
          code,
        },
      });
    } catch (err) {
      console.error('Email not sent', err);
    }
  }
}
