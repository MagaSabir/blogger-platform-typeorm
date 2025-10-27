import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query-repository/users.query-repository';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { UserViewModel } from '../../api/view-dto/user-view-model';

export class GetAllUsersQuery {
  constructor(public params: UsersQueryParams) {}
}

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  constructor(private queryRepository: UsersQueryRepository) {}

  async execute(
    query: GetAllUsersQuery,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    return this.queryRepository.getUsers(query.params);
  }
}
