import { UsersRepository } from '../../../infrastructure/users.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { User } from '../../../entity/user.entity';

export class DeleteUserCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    const user: User = await this.userRepository.findUserOrThrowNotFound(
      command.id,
    );

    if (user) await this.userRepository.deleteUserById(command.id);
  }
}
