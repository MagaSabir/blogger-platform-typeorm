import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor() {}

  async execute(command: CreatePairConnectionCommand) {
    const userId = command.userId;
  }
}
