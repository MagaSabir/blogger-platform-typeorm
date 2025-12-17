import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private queryBus: QueryBus) {}

  @Post('connection')
  async connectionGame() {}
}
