import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { PasswordRecoveryEvent } from '../events/password-recovery.event';
import { BadRequestException } from '@nestjs/common';
import { addHours } from '../../../../../core/utils/date.util';
import { User } from '../../entity/user.entity';

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
    const user: User | null =
      await this.usersRepository.findUnconfirmedUserByEmail(command.email);
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
    const code = randomUUID();
    const expiration: Date = addHours(1);

    user.updateConfirmationCode(code, expiration);

    await this.usersRepository.save(user);
    this.eventBus.publish(new PasswordRecoveryEvent(user.email, code));
  }
}
