import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../entity/user.entity';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private userRepository: UsersRepository) {}

  async execute(command: RegistrationConfirmationCommand): Promise<void> {
    const user: User | null = await this.userRepository.findUserByCode(
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

    user.emailConfirm(command.code);
    await this.userRepository.save(user);
  }
}
