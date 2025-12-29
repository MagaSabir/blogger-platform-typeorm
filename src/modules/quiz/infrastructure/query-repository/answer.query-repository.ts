import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../../entitys/answer.entity';
import { Repository } from 'typeorm';
import { AnswerViewModel } from '../../api/view-models/game-view-model';

@Injectable()
export class AnswerQueryRepository {
  constructor(@InjectRepository(Answer) private repo: Repository<Answer>) {}

  async getAnswer(answerId: string): Promise<AnswerViewModel | undefined> {
    return this.repo
      .createQueryBuilder('a')
      .select([
        'a.questionId as questionId',
        'a.status as answerStatus',
        'a.addedAt as addedAt',
      ])
      .where('a.id =:answerId', { answerId })
      .getRawOne();
  }
}
