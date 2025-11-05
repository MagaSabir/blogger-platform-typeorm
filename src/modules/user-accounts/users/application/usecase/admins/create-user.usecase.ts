import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { PasswordService } from '../../services/password.service';
import { UsersConfig } from '../../../../config/users.config';
import { BadRequestException } from '@nestjs/common';

import { User } from '../../../entity/user.entity';
import { CreateUserInputDto } from '../../../api/input-dto/create-user.input-dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private userConfig: UsersConfig,
  ) {}
  async execute(command: CreateUserCommand): Promise<number> {
    const { login, email, password } = command.dto;
    const existUser: User | null =
      await this.usersRepository.findUserByLoginOrEmail(login, email);

    if (existUser) throw new BadRequestException('User already exists');

    const passwordHash = await this.passwordService.hash(password);
    const user = User.createUser({
      login,
      email,
      passwordHash,
      isConfirmed: this.userConfig.isAutoConfirmed,
    });
    const createdUser = await this.usersRepository.save(user);
    return createdUser.id;
  }
}
