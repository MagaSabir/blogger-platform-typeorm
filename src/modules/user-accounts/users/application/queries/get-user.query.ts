import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthQueryRepository } from '../../infrastructure/query-repository/auth.query-repository';
import { UserViewModel } from '../../api/view-dto/user-view-model';

export class GetUserQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(private authQueryRepository: AuthQueryRepository) {}

  async execute(query: GetUserQuery) {
    const user: UserViewModel = await this.authQueryRepository.getUser(
      query.userId,
    );
    return user;
  }
}
