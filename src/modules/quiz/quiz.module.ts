import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entitys/questions.entity';
import { QuizAdminController } from './api/admin/quiz-admin.controller';
import { Player } from './entitys/player.entity';
import { Game } from './entitys/game.entity';
import { GameQuestion } from './entitys/game-question.entity';
import { Answer } from './entitys/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Player, Game, GameQuestion, Answer]),
  ],
  controllers: [QuizAdminController],
  providers: [],
})
export class QuizModule {}
