import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { PasswordRecoveryEvent } from '../events/password-recovery.event';
import { BadRequestException } from '@nestjs/common';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
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
    const code = uuidv4();

    await this.usersRepository.updateConfirmationCode(code, user.email);
    this.eventBus.publish(new PasswordRecoveryEvent(user.email, code));
  }
}
