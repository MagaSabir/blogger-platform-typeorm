import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor(private repo: GameRepository) {}

  async execute(command: CreatePairConnectionCommand) {}
}
