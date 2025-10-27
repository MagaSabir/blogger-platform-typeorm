import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../../notification/email.service';
import { BadRequestException } from '@nestjs/common';

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
    const user = await this.usersRepository.findIsNotConfirmedUsersByEmail(
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

    const code: string = uuidv4();

    await this.usersRepository.updateConfirmationCode(code, user.email);
    this.emailService.sendConfirmationEmail(user.email, code);
  }
}
