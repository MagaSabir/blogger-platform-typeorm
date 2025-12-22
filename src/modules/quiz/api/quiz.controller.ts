import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { CreatePairConnectionCommand } from '../application/usecase/create-pair-connection.usecase';
import { Game } from '../entitys/game.entity';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private commandBus: CommandBus) {}

  @Post('connection')
  async connect(@CurrentUserId() userId: string): Promise<Game> {
    return this.commandBus.execute(new CreatePairConnectionCommand(userId));
  }
}
