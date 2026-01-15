import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { GetStatisticQuery } from '../application/queries/get-statistic.query';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { TopGameQueryParams } from './admin/input-dto/top-game.query-params';
import { SortCustomPipe, SortParam } from './admin/input-dto/sort-custom.pipe';
import { StatisticViewModel } from './view-models/statistic.view-model';
import { GetTopUsersQuery } from '../application/queries/get-top-users.query';

@Controller('pair-game-quiz/users')
export class GameUsersController {
  constructor(private queryBus: QueryBus) {}

  @Get('my-statistic')
  @UseGuards(JwtAuthGuard)
  async getStatistics(
    @CurrentUserId() userId: string,
  ): Promise<StatisticViewModel> {
    return this.queryBus.execute(new GetStatisticQuery(userId));
  }

  @Get('top')
  @UseGuards(JwtOptionalAuthGuard)
  async getTop(
    @CurrentUserId() userId: string,
    @Query() query: TopGameQueryParams,
    @Query('sort', SortCustomPipe)
    sort: SortParam[],
  ) {
    return this.queryBus.execute(new GetTopUsersQuery(userId, query, sort));
  }
}
