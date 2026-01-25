import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EntityManager } from 'typeorm';
import { PlayerStatsService } from '../application/service/player-stats.service';
import { Player } from '../entitys/player.entity';
import { Statistic } from '../entitys/statistic.entity';
import { Game, GameStatus } from '../entitys/game.entity';

@Processor('game')
export class GameProcessor extends WorkerHost {
  constructor(
    private entityManager: EntityManager,
    private statsService: PlayerStatsService,
  ) {
    super();
  }

  async process(job: Job<{ gameId: string }>) {
    const gameId = job.data.gameId;
    console.log(`[Worker] Started for game: ${gameId}`);

    await this.entityManager.transaction(async (manager) => {
      const gameRepo = manager.getRepository(Game);
      const playerRepo = manager.getRepository(Player);
      const statsRepo = manager.getRepository(Statistic);

      const gameExist = await gameRepo.findOne({
        where: { id: gameId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!gameExist || gameExist.status === GameStatus.FINISHED) {
        return;
      }

      const game = await gameRepo.findOne({
        where: { id: gameId },
        relations: ['players'],
      });

      if (!game || game.players.length < 2) {
        return;
      }

      const player1 = game.players[0];
      const player2 = game.players[1];

      const finishedPlayer = game.players.find((p) => p.finishedAt !== null);
      const unfinishedPlayer = game.players.find((p) => p.finishedAt === null);

      if (unfinishedPlayer) {
        unfinishedPlayer.finish(); // Ставим finishedAt = new Date()
        await playerRepo.save(unfinishedPlayer);
      }

      if (finishedPlayer && finishedPlayer.score > 0) {
        finishedPlayer.score += 1;
        await playerRepo.save(finishedPlayer);
      }

      game.status = GameStatus.FINISHED;
      game.finishGameDate = new Date();
      await gameRepo.save(game);
      await this.statsService.updateStats(player1, player2, statsRepo);
    });
  }
}
