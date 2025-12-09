import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './admin/entitys/questions.entity';
import { QuizAdminController } from './admin/api/quiz-admin.controller';
import { Player } from './admin/entitys/player.entity';
import { Game } from './admin/entitys/game.entity';
import { GameQuestion } from './admin/entitys/game-question.entity';
import { Answer } from './admin/entitys/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Player, Game, GameQuestion, Answer]),
  ],
  controllers: [QuizAdminController],
  providers: [],
})
export class QuizModule {}
