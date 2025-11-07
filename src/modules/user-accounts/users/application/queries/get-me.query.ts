import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthQueryRepository } from '../../infrastructure/query-repository/auth.query-repository';
import { MeViewModel } from '../../api/view-dto/me-view-model';

export class GetMeQuery {
  constructor(public userId: number) {}
}

@QueryHandler(GetMeQuery)
export class GetMeQueryHandler implements IQueryHandler<GetMeQuery> {
  constructor(private authQueryRepository: AuthQueryRepository) {}

  async execute(query: GetMeQuery): Promise<MeViewModel> {
    const user = await this.authQueryRepository.getUser(query.userId);
    return MeViewModel.meMapToViewModel(user);
  }
}
