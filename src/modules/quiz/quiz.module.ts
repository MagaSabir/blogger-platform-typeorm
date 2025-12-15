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

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Player, Game, GameQuestion, Answer]),
    CqrsModule,
  ],
  controllers: [QuizAdminController],
  providers: [QuestionRepository, CreateQuestionUseCase, DeleteQuestionUseCase],
})
export class QuizModule {}
