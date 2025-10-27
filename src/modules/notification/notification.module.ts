import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: 'testnodemailer001@mail.ru',
          pass: 'QtLW3sICZ9QL6ETM9efh',
        },
      },
      defaults: {
        from: '"MyApp 👻" <testnodemailer001@mail.ru>',
      },
      template: {
        dir: path.join(
          process.cwd(),
          'src',
          'modules',
          'notification',
          'templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationModule {}
