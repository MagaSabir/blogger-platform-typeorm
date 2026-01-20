import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Player } from '../entitys/player.entity';
import { Game, GameStatus } from '../entitys/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectQueue('game') private gameQueue: Queue) {}

  async playerFinished(game: Game, player: Player, otherPlayer: Player) {
    if (
      player.finishedAt &&
      otherPlayer.finishedAt === null &&
      game.status === GameStatus.ACTIVE
    ) {
      await this.gameQueue.add('finish', { gameId: game.id }, { delay: 10000 });
    }

    if (player.finishedAt && otherPlayer.finishedAt) {
      game.status = GameStatus.FINISHED;
      game.finishGameDate = new Date();
    }
  }
}
