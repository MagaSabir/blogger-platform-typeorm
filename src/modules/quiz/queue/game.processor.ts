import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('game')
export class GameProcessor extends WorkerHost {
  private logger = new Logger(GameProcessor.name);

  async process(job: Job<{ gameId: string }>) {
    this.logger.log(`Tаймер сработал! Игра ${job.data.gameId} завершена!`);

    console.log('===================================');
    console.log(`🔔 УВЕДОМЛЕНИЕ: Игра ${job.data.gameId} завершена!`);
    console.log(`   Второй игрок не ответил за 10 секунд`);
    console.log('===================================');

    return { gameId: job.data.gameId, completed: true };
  }
}
