import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user-accounts/users/entity/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { Session } from '../user-accounts/sessions/entity/session.entity';
import { Blog } from '../blogger-platform/blogs/entity/blog.entity';
import { Post } from '../blogger-platform/posts/entity/post.entity';
import { Game } from '../quiz/entitys/game.entity';
import { Question } from '../quiz/entitys/questions.entity';
import { GameQuestion } from '../quiz/entitys/game-question.entity';
import { Answer } from '../quiz/entitys/answer.entity';
import { Player } from '../quiz/entitys/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Session,
      Blog,
      Post,
      Game,
      Question,
      GameQuestion,
      Answer,
      Player,
    ]),
    CqrsModule,
  ],

  controllers: [TestingController],
})
export class TestingModule {}
