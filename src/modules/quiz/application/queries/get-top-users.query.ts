import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TopGameQueryParams } from '../../api/admin/input-dto/top-game.query-params';
import { SortParam } from '../../api/admin/input-dto/sort-custom.pipe';
import { PlayerQueryRepository } from '../../infrastructure/query-repository/player.query.repository';

export class GetTopUsersQuery {
  constructor(
    public userId: string,
    public queryParams: TopGameQueryParams,
    public sort: SortParam[],
  ) {}
}

@QueryHandler(GetTopUsersQuery)
export class GetTopUsersQueryHandler
  implements IQueryHandler<GetTopUsersQuery>
{
  constructor(private repo: PlayerQueryRepository) {}
  async execute(query: GetTopUsersQuery) {
    return this.repo.getTopUsers(query.userId, query.queryParams, query.sort);
  }
}
