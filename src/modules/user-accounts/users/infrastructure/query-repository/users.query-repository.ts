import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { UserViewModel } from '../../api/view-dto/user-view-model';
import { User } from '../../entity/user.entity';

export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private user: Repository<User>,
  ) {}

  // async getUsers(
  //   queryParams: UsersQueryParams,
  // ): Promise<BasePaginatedResponse<UserViewModel>> {
  //   const query = `
  //       SELECT id, login, email, "createdAt"
  //       FROM "Users"
  //       WHERE  login ILIKE '%' || $1 || '%'
  //          AND email ILIKE '%' || $2 || '%'
  //       ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
  //       LIMIT $3 OFFSET $4
  //   `;
  //
  //   const count = `
  //       SELECT COUNT(*) as "totalCount"
  //       FROM "Users"
  //       WHERE  login ILIKE '%' || $1 || '%'
  //         AND email ILIKE '%' || $2 || '%'
  //   `;
  //
  //   const [items, totalCountResult] = await Promise.all([
  //     this.dataSource.query<UserViewModel[]>(query, [
  //       queryParams.searchLoginTerm || '',
  //       queryParams.searchEmailTerm || '',
  //       queryParams.pageSize,
  //       queryParams.calculateSkip(),
  //     ]),
  //     this.dataSource.query<{ totalCount: number }>(count, [
  //       queryParams.searchLoginTerm || '',
  //       queryParams.searchEmailTerm || '',
  //     ]),
  //   ]);
  //   const totalCount: number = parseInt(totalCountResult[0].totalCount);
  //
  //   return {
  //     pagesCount: Math.ceil(totalCount / queryParams.pageSize),
  //     page: queryParams.pageNumber,
  //     pageSize: queryParams.pageSize,
  //     totalCount,
  //     items,
  //   };
  // }

  async getUsers(query: UsersQueryParams) {
    const users = await this.user.findAndCount({
      skip: query.calculateSkip(),
    });
    return users;
  }
}

//pagesCount: Math.ceil(totalCount / query.pageSize)

//(pageNumber - 1) * pageSize
