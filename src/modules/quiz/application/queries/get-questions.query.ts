import { IQueryHandler } from '@nestjs/cqrs';

export class GetQuestionQuery {
  constructor() {}
}
export class GetQuestionsQueryHandler
  implements IQueryHandler<GetQuestionQuery>
{
  async execute() {}
}
