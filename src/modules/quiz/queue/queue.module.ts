import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { GameProcessor } from './game.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'game',
    }),
  ],
  providers: [GameProcessor],
  exports: [BullModule],
})
export class QueueModule {}
