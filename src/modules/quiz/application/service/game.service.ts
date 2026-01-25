import { Injectable } from '@nestjs/common';
import { Player } from '../../entitys/player.entity';
import { Game, GameStatus } from '../../entitys/game.entity';

@Injectable()
export class GameService {
  checkAndFinishGame(game: Game, p1: Player, p2: Player) {
    const finishedPlayer = [p1, p2].filter((p) => p.finishedAt).length;
    if (finishedPlayer === 2) {
      this.gameFinish(game, p1, p2);
      return true;
    } else {
      return false;
    }
  }
  gameFinish(game: Game, p1: Player, p2: Player) {
    if (p1.finishedAt && p2.finishedAt) {
      if (p1.finishedAt < p2.finishedAt && p1.score > 0) {
        p1.score += 1;
      } else if (p2.finishedAt < p1.finishedAt && p2.score > 0) {
        p2.score += 1;
      }
    }
    game.status = GameStatus.FINISHED;
    game.finishGameDate = new Date();
  }
}
