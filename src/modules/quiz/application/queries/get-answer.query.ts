import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { AnswerQueryRepository } from '../../infrastructure/query-repository/answer.query-repository';

export class GetAnswerQuery {
  constructor(public answerId: string) {}
}
@CommandHandler(GetAnswerQuery)
export class GetAnswerQueryHandler implements IQueryHandler<GetAnswerQuery> {
  constructor(private repo: AnswerQueryRepository) {}

  async execute(query: GetAnswerQuery) {
    return this.repo.getAnswer(query.answerId);
  }
}
