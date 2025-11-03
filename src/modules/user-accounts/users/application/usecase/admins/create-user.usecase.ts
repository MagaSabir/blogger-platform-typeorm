import { CreateUserDto } from '../../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserViewModel } from '../../../api/view-dto/user-view-model';
import { PasswordService } from '../../services/password.service';
import { UsersConfig } from '../../../../config/users.config';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { User } from '../../../entity/user.entity';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
    private userConfig: UsersConfig,
  ) {}
  async execute(command: CreateUserCommand) {
    // const user: UserViewModel =
    //   await this.usersRepository.findUserByLoginOrEmail(
    //     command.dto.login,
    //     command.dto.email,
    //   );
    // if (user) throw new BadRequestException('User already exists');
    const user = User.createUser(command.dto);
    const passwordHash: string = await this.passwordService.hash(
      command.dto.password,
    );

    user.passwordHash = passwordHash;
    user.isConfirmed = this.userConfig.isAutoConfirmed;
    user.confirmationCode = randomUUID();
    return this.usersRepository.save(user);
  }
}
