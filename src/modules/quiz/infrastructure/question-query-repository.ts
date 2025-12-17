import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entitys/questions.entity';
import { QuestionQueryParams } from '../api/admin/input-dto/question-query-params';

@Injectable()
export class QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async getQuestions(queryParams: QuestionQueryParams) {
    const query = this.questionRepository
      .createQueryBuilder('q')
      .select([
        'q.id as id',
        'q.body as body',
        'q.correctAnswers as "correctAnswers"',
        'q.published as published',
        'q.createdAt as "createdAt"',
        'q.updatedAt as "updatedAt"',
      ])
      .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
      .offset(queryParams.calculateSkip())
      .limit(queryParams.pageSize);

    if (queryParams.bodySearchTerm) {
      query.andWhere('q.body ILIKE :body', {
        body: `%${queryParams.bodySearchTerm}%`,
      });
    }
    const totalCount = await query.getCount();

    const questions = await query.getRawMany();

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: questions,
    };
  }
}
