import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { CreatePairConnectionCommand } from '../application/usecase/create-pair-connection.usecase';
import { GetGameQuery } from '../application/queries/get-game-query';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('connection')
  async connect(@CurrentUserId() userId: string) {
    const gameId: string = await this.commandBus.execute(
      new CreatePairConnectionCommand(userId),
    );

    return this.queryBus.execute(new GetGameQuery(gameId));
  }
}
