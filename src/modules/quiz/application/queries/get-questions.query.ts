import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuestionQueryParams } from '../../api/admin/input-dto/question-query-params';
import { QuestionQueryRepository } from '../../infrastructure/question-query-repository';

export class GetQuestionQuery {
  constructor(public queryParams: QuestionQueryParams) {}
}

@QueryHandler(GetQuestionQuery)
export class GetQuestionsQueryHandler
  implements IQueryHandler<GetQuestionQuery>
{
  constructor(private queryRepo: QuestionQueryRepository) {}

  async execute(query: GetQuestionQuery) {
    return this.queryRepo.getQuestions(query.queryParams);
  }
}
