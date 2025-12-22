import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { Game } from '../../entitys/game.entity';
import { ForbiddenException } from '@nestjs/common';
import { PlayerRepository } from '../../infrastructure/player.repository';

export class CreatePairConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairConnectionCommand)
export class CreatePairConnectionUseCase
  implements ICommandHandler<CreatePairConnectionCommand>
{
  constructor(
    private gameRepo: GameRepository,
    private playerRepo: PlayerRepository,
  ) {}

  async execute(command: CreatePairConnectionCommand): Promise<string> {
    if (await this.playerRepo.hasActiveGame(command.userId)) {
      throw new ForbiddenException('Already in game');
    }

    let game = await this.gameRepo.findPendingGame();

    if (!game) {
      game = Game.create();
    }

    game.addPlayer(command.userId);

    await this.gameRepo.save(game);
    return game.id;
  }
}
