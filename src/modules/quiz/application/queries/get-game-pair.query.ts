import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';

export class GetGamePairQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetGamePairQuery)
export class GetGamePairQueryHandler {
  constructor(private queryRepo: GameQueryRepository) {}

  async execute(query: GetGamePairQuery) {
    const game = await this.queryRepo.findGameUnFinishedByUserId(query.userId);
    console.log(game);
    return game;
  }
}
