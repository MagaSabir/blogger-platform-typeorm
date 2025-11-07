import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from '../services/password.service';
import { BadRequestException } from '@nestjs/common';

export class NewPasswordCommand {
  constructor(
    public newPassword: string,
    public code: string,
  ) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase {
  constructor(
    private passwordService: PasswordService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: NewPasswordCommand) {
    const user = await this.usersRepository.findUserByCode(command.code);
    if (!user)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed',
            field: 'email',
          },
        ],
      });

    const passwordHash: string = await this.passwordService.hash(
      command.newPassword,
    );

    user.newPassword(passwordHash);
    await this.usersRepository.save(user);
  }
}
