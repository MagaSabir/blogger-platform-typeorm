import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService } from '../services/password.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { UserViewModel } from '../../api/view-dto/user-view-model';
import { EmailService } from '../../../../notification/email.service';

export class RegistrationUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private passwordService: PasswordService,
    private userRepository: UsersRepository,
    private mailService: EmailService,
  ) {}

  async execute({ dto }: RegistrationUserCommand) {
    const existsUser: UserViewModel =
      await this.userRepository.findUserByLoginOrEmail(dto.login, dto.email);
    if (existsUser) {
      if (existsUser.login === dto.login) {
        throw new BadRequestException({
          errorsMessages: [
            {
              message: 'Login already exists',
              field: 'login',
            },
          ],
        });
      }
      if (existsUser.email === dto.email) {
        throw new BadRequestException({
          errorsMessages: [
            {
              message: 'Email already exists',
              field: 'email',
            },
          ],
        });
      }
    }

    const passwordHash: string = await this.passwordService.hash(dto.password);

    const code: string = uuidv4();

    const user = {
      login: dto.login,
      passwordHash,
      email: dto.email,
      confirmationCode: code,
    };
    await this.userRepository.registerUser(user);
    this.mailService.sendConfirmationEmail(user.email, code);
  }
}
