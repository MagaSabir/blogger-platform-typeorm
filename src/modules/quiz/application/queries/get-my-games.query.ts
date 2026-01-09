import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';
import { GameViewModel } from '../../api/view-models/game-view-model';

export class GetMyGamesQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetMyGamesQuery)
export class GetMyGamesQueryHandler {
  constructor(private gameRepo: GameQueryRepository) {}

  async execute(query: GetMyGamesQuery): Promise<GameViewModel | null> {
    return this.gameRepo.findGameById(query.userId);
  }
}
