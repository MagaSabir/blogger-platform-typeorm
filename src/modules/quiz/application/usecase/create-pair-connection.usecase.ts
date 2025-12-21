import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { Game } from '../../entitys/game.entity';
import { ForbiddenException } from '@nestjs/common';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor(private repo: GameRepository) {}

  async execute(command: CreatePairConnectionCommand) {
    if (await this.repo.hasActiveGame(command.userId)) {
      throw new ForbiddenException('Already in game');
    }

    const pendingGame = await this.repo.findPendingGame();

    // console.log(game);
  }
}
