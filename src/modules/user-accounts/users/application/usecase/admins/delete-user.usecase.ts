import { UsersRepository } from '../../../infrastructure/users.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { UserViewModel } from '../../../api/view-dto/user-view-model';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    const user: UserViewModel =
      await this.userRepository.findUserOrThrowNotFound(command.id);

    if (user) await this.userRepository.deleteUserById(command.id);
  }
}
