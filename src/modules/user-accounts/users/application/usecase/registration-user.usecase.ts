import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService } from '../services/password.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../../../notification/email.service';
import { User } from '../../entity/user.entity';
import { randomUUID } from 'crypto';
import { CreateUserInputDto } from '../../api/input-dto/create-user.input-dto';
import { addHours } from '../../../../../core/utils/date.util';

export class RegistrationUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private passwordService: PasswordService,
    private usersRepository: UsersRepository,
    private mailService: EmailService,
  ) {}

  async execute(command: RegistrationUserCommand) {
    const { login, email, password } = command.dto;
    const existing: User | null =
      await this.usersRepository.findUserByLoginOrEmail(login, email);
    if (existing) {
      const field = existing.login === login ? 'login' : 'email';
      throw new BadRequestException({
        errorsMessages: [{ message: `${field} already exists`, field }],
      });
    }

    const passwordHash: string = await this.passwordService.hash(password);

    const code: string = randomUUID();

    const user = User.registerUser({
      login,
      email,
      passwordHash,
      confirmationCode: code,
      confirmationCodeExpiration: addHours(1),
    });
    const createdUser = await this.usersRepository.save(user);
    this.mailService.sendConfirmationEmail(user.email, code);
    return createdUser.id;
  }
}
