import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';
import { GameViewModel } from '../../api/view-models/game-view-model';
import { GameQueryParams } from '../../api/admin/input-dto/game.query-params';

export class GetMyGamesQuery {
  constructor(
    public userId: string,
    public params: GameQueryParams,
  ) {}
}

@QueryHandler(GetMyGamesQuery)
export class GetMyGamesQueryHandler {
  constructor(private gameRepo: GameQueryRepository) {}

  async execute(query: GetMyGamesQuery) {
    return this.gameRepo.findMyGame(query.userId, query.params);
  }
}
