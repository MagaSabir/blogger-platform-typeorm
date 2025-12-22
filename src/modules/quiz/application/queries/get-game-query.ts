import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';

export class GetGameQuery {
  constructor(public gameId: string) {}
}

@QueryHandler(GetGameQuery)
export class GetGameQueryHandler {
  constructor(private gameRepo: GameQueryRepository) {}

  async execute(query: GetGameQuery) {
    return this.gameRepo.findGameById(query.gameId);
  }
}
