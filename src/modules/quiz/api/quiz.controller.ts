import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUserId } from '../../../core/decorators/current-user-id';
import { CreatePairConnectionCommand } from '../application/usecase/create-pair-connection.usecase';
import { GetGameQuery } from '../application/queries/get-game-query';
import { AnswerViewModel, GameViewModel } from './view-models/game-view-model';
import { AnswerInputDto } from './admin/input-dto/answer.input-dto';
import { AnswerCommand } from '../application/usecase/answer.usecase';
import { GetAnswerQuery } from '../application/queries/get-answer.query';
import { GetGamePairQuery } from '../application/queries/get-game-pair.query';
import { GetGameByIdQuery } from '../application/queries/get-game-by-id.query';
import { IdInputDto } from './admin/input-dto/id-input.dto';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async connect(@CurrentUserId() userId: string): Promise<GameViewModel> {
    const gameId: string = await this.commandBus.execute(
      new CreatePairConnectionCommand(userId),
    );
    return this.queryBus.execute(new GetGameQuery(gameId));
  }

  @Post('my-current/answers')
  @HttpCode(HttpStatus.OK)
  async answers(
    @CurrentUserId() userId: string,
    @Body() dto: AnswerInputDto,
  ): Promise<AnswerViewModel> {
    const answerId: string = await this.commandBus.execute(
      new AnswerCommand(userId, dto),
    );
    return await this.queryBus.execute(new GetAnswerQuery(answerId));
  }

  @Get('my-current')
  async myCurrent(@CurrentUserId() userId: string): Promise<GameViewModel> {
    return this.queryBus.execute(new GetGamePairQuery(userId));
  }

  @Get(':id')
  async getGameById(
    @Param() params: IdInputDto,
    @CurrentUserId() userId: string,
  ): Promise<GameViewModel> {
    return this.queryBus.execute(new GetGameByIdQuery(params.id, userId));
  }
}
