import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { UserViewModel } from '../../api/view-dto/user-view-model';
import { User } from '../../entity/user.entity';
import { PaginatedBuilder } from '../../../../../core/utils/paginated-builder';

export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getUsers(
    query: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    const where = PaginatedBuilder.where(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
    const [users, totalCount] = await this.userRepo.findAndCount({
      where,
      take: query.pageSize,
      skip: query.calculateSkip(),
      order: { [query.sortBy]: query.sortDirection },
    });

    const items: UserViewModel[] = UserViewModel.mapToViewModels(users);

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }
}

//pagesCount: Math.ceil(totalCount / query.pageSize)

//(pageNumber - 1) * pageSize
