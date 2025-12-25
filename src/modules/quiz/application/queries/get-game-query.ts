import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';
import { GameViewModel } from '../../api/view-models/game-view-model';

export class GetGameQuery {
  constructor(public gameId: string) {}
}

@QueryHandler(GetGameQuery)
export class GetGameQueryHandler {
  constructor(private gameRepo: GameQueryRepository) {}

  async execute(query: GetGameQuery): Promise<GameViewModel | null> {
    return this.gameRepo.findGameById(query.gameId);
  }
}
