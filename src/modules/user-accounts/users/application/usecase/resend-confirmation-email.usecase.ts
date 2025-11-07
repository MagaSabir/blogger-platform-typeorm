import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../../notification/email.service';
import { BadRequestException } from '@nestjs/common';
import { addHours } from '../../../../../core/utils/date.util';

export class ResendConfirmationEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmationEmailCommand)
export class ResendConfirmationEmailUseCase
  implements ICommandHandler<ResendConfirmationEmailCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: ResendConfirmationEmailCommand) {
    const user = await this.usersRepository.findUnconfirmedUserByEmail(
      command.email,
    );
    if (!user) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed',
            field: 'email',
          },
        ],
      });
    }

    const code: string = randomUUID();
    const expiration: Date = addHours(1);
    user.updateConfirmationCode(code, expiration);
    await this.usersRepository.save(user);
    this.emailService.sendConfirmationEmail(user.email, code);
  }
}
