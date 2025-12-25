import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../entitys/answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerRepository {
  constructor(@InjectRepository(Answer) private repo: Repository<Answer>) {}

  async countByPlayerId(playerId: string): Promise<number> {
    return this.repo.count({ where: { playerId } });
  }

  async save(answer: Answer) {
    await this.repo.save(answer);
  }
}
