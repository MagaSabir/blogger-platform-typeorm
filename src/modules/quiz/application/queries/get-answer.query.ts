import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AnswerQueryRepository } from '../../infrastructure/query-repository/answer.query-repository';
import { AnswerViewModel } from '../../api/view-models/game-view-model';

export class GetAnswerQuery {
  constructor(public answerId: string) {}
}
@QueryHandler(GetAnswerQuery)
export class GetAnswerQueryHandler implements IQueryHandler<GetAnswerQuery> {
  constructor(private repo: AnswerQueryRepository) {}

  async execute(query: GetAnswerQuery): Promise<AnswerViewModel | undefined> {
    console.log(await this.repo.getAnswer(query.answerId));
    return this.repo.getAnswer(query.answerId);
  }
}
