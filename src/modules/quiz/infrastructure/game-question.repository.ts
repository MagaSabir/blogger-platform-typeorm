import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameQuestion } from '../entitys/game-question.entity';

@Injectable()
export class GameQuestionRepository {
  constructor(
    @InjectRepository(GameQuestion)
    private gameQuestionRepo: Repository<GameQuestion>,
  ) {}

  async save(question: GameQuestion[]) {
    await this.gameQuestionRepo.save(question);
  }
}
