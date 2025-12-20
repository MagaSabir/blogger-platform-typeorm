import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { CreatePairConnectionCommand } from '../application/usecase/create-pair-connection.usecase';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private commandBus: CommandBus) {}

  @Post('connection')
  async connect(@CurrentUserId() userId: string) {
    console.log(
      await this.commandBus.execute(new CreatePairConnectionCommand(userId)),
    );
  }
}
