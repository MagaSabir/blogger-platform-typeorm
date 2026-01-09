import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlayerQueryRepository } from '../../infrastructure/query-repository/player.query.repository';
import { StatisticViewModel } from '../../api/view-models/statistic.view-model';

export class GetStatisticQuery {
  constructor(public userId: string) {}
}
@QueryHandler(GetStatisticQuery)
export class GetStatisticQueryHandler
  implements IQueryHandler<GetStatisticQuery>
{
  constructor(private playerRepo: PlayerQueryRepository) {}
  async execute(query: GetStatisticQuery): Promise<StatisticViewModel> {
    return this.playerRepo.getStatistic(query.userId);
  }
}
