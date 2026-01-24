import { Queue } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectQueue('game')
    private gameTimeoutQueue: Queue,
  ) {}
  async onFirstPlayerFinished(gameId: string, playerId: string) {
    this.logger.log(`🎮 Игрок ${playerId} завершил игру ${gameId}`);
    this.logger.log(`⏳ Запускаю таймер на 10 секунд...`);

    // Добавляем задачу в очередь с задержкой 10 секунд
    const job = await this.gameTimeoutQueue.add(
      'timeout-job',
      {
        gameId,
        playerId,
        timestamp: new Date().toISOString(),
      },
      {
        delay: 10000,
        jobId: `timeout-${gameId}`,
        removeOnComplete: true,
      },
    );

    this.logger.log(`✅ Таймер установлен. Job ID: ${job.id}`);

    return job.id;
  }
}
