import { QueryHandler } from '@nestjs/cqrs';
import { GameQueryRepository } from '../../infrastructure/query-repository/game.query-repository';
import { GameViewModel } from '../../api/view-models/game-view-model';
import { NotFoundException } from '@nestjs/common';

export class GetGamePairQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetGamePairQuery)
export class GetGamePairQueryHandler {
  constructor(private queryRepo: GameQueryRepository) {}

  async execute(query: GetGamePairQuery): Promise<GameViewModel | null> {
    const game = await this.queryRepo.findGameUnFinishedByUserId(query.userId);
    if (!game) {
      throw new NotFoundException();
    }
    return game;
  }
}
