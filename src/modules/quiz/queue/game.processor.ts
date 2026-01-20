import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('game')
export class GameProcessor extends WorkerHost {
  async process(job: Job<{ gameId: string }>) {
    const gameId: string = job.data.gameId;
  }
}
