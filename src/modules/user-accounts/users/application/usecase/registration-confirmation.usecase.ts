import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDbModel } from '../../api/view-dto/user-db-model';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../../../notification/email.service';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(
    private userRepository: UsersRepository,
    private eventBus: EventBus,
    private mailService: EmailService,
  ) {}

  async execute(command: RegistrationConfirmationCommand): Promise<void> {
    const user: UserDbModel = await this.userRepository.findUserByCode(
      command.code,
    );

    if (!user || user.isConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email is confirmed or not Found',
            field: 'code',
          },
        ],
      });
    }

    if (user.confirmationCodeExpiration < new Date()) {
      throw new BadRequestException('CodeExpiration');
    }

    await this.userRepository.confirmUserEmail(user.id);
  }
}
