import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../notification/email.service';
import { UserRegisteredEvent } from './user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private mailService: EmailService) {}

  async handle(event: UserRegisteredEvent) {
    await this.mailService.sendConfirmationEmail(event.email, event.code);
  }
}
