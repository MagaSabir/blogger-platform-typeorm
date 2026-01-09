import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { GetStatisticQuery } from '../application/queries/get-statistic.query';

@Controller('pair-game-quiz/users')
@UseGuards(JwtAuthGuard)
export class GameStatisticsController {
  constructor(private queryBus: QueryBus) {}

  @Get('my-statistic')
  async getStatistics(@CurrentUserId() userId: string) {
    return this.queryBus.execute(new GetStatisticQuery(userId));
  }
}
