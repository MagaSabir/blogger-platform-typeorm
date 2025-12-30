import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';
import { GameViewModel } from '../../api/view-models/game-view-model';

export class GetGameByIdQuery {
  constructor(
    public gameId: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetGameByIdQuery)
export class GetGameQueryByIdHandler {
  constructor(private gameRepo: GameQueryRepository) {}

  async execute(query: GetGameByIdQuery): Promise<GameViewModel | null> {
    return this.gameRepo.findGameByGameId(query.userId, query.gameId);
  }
}
