import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entitys/questions.entity';
import { Repository } from 'typeorm';
import { GameQuestion } from '../entitys/game-question.entity';

@Injectable()
export class GameQuestionRepository {
  constructor(
    @InjectRepository(GameQuestion)
    private questionRepo: Repository<GameQuestion>,
  ) {}

  async save(question: GameQuestion[]) {
    await this.questionRepo.save(question);
  }
}
