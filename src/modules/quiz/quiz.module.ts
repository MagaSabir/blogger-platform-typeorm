import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entitys/questions.entity';
import { QuizAdminController } from './api/admin/quiz-admin.controller';
import { Player } from './entitys/player.entity';
import { Game } from './entitys/game.entity';
import { GameQuestion } from './entitys/game-question.entity';
import { Answer } from './entitys/answer.entity';
import { QuestionRepository } from './infrastructure/question.repository';
import { CreateQuestionUseCase } from './application/usecase/create-question.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteQuestionUseCase } from './application/usecase/delete-question.usecase';
import { ChangeQuestionStatusUseCase } from './application/usecase/change-question-status.usecase';
import { UpdateQuestionUseCase } from './application/usecase/update-question.usecase';
import { GetQuestionsQueryHandler } from './application/queries/get-questions.query';
import { QuestionQueryRepository } from './infrastructure/query-repository/question-query-repository';
import { CreatePairConnectionUseCase } from './application/usecase/create-pair-connection.usecase';
import { GameRepository } from './infrastructure/game.repository';
import { QuizController } from './api/quiz.controller';
import { PlayerRepository } from './infrastructure/player.repository';
import { GetGameQueryHandler } from './application/queries/get-game-query';
import { GameQueryRepository } from './infrastructure/query-repository/game.query-repository';
import { GameQuestionRepository } from './infrastructure/game-question.repository';
import { AnswerRepository } from './infrastructure/answer.repository';
import { AnswerUseCase } from './application/usecase/answer.usecase';
import { AnswerQueryRepository } from './infrastructure/query-repository/answer.query-repository';
import { GetAnswerQueryHandler } from './application/queries/get-answer.query';
import { GetGamePairQueryHandler } from './application/queries/get-game-pair.query';
import { GetGameQueryByIdHandler } from './application/queries/get-game-by-id.query';
import { PlayerQueryRepository } from './infrastructure/query-repository/player.query.repository';
import { GetStatisticQueryHandler } from './application/queries/get-statistic.query';
import { GameUsersController } from './api/game-users.controller';
import { GetMyGamesQueryHandler } from './application/queries/get-my-games.query';
import { Statistic } from './entitys/statistic.entity';
import { PlayerStatsService } from './application/service/player-stats.service';
import { GetTopUsersQueryHandler } from './application/queries/get-top-users.query';
import { GameService } from './application/service/game.service';
import { BullModule } from '@nestjs/bullmq';
import { GameProcessor } from './queue/game.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Player,
      Game,
      GameQuestion,
      Answer,
      Statistic,
    ]),
    CqrsModule,
    BullModule.registerQueue({
      name: 'game',
    }),
  ],
  controllers: [QuizAdminController, QuizController, GameUsersController],
  providers: [
    GameProcessor,
    QuestionRepository,
    QuestionQueryRepository,
    PlayerRepository,
    GameQueryRepository,
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    ChangeQuestionStatusUseCase,
    UpdateQuestionUseCase,
    GetQuestionsQueryHandler,
    GetGameQueryHandler,
    CreatePairConnectionUseCase,
    GameRepository,
    GameQuestionRepository,
    AnswerRepository,
    AnswerQueryRepository,
    PlayerQueryRepository,
    GetAnswerQueryHandler,
    GetGamePairQueryHandler,
    GetGameQueryByIdHandler,
    GetStatisticQueryHandler,
    GetMyGamesQueryHandler,
    GetTopUsersQueryHandler,
    AnswerUseCase,
    PlayerStatsService,
    GameService,
  ],
})
export class QuizModule {}
