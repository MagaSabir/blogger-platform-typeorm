import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { UserViewModel } from '../../api/view-dto/user-view-model';

export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(
    queryParams: UsersQueryParams,
  ): Promise<BasePaginatedResponse<UserViewModel>> {
    // const query = `
    //     SELECT id::text, login, email, "createdAt"
    //     FROM "Users"
    //     WHERE ($1::text IS NULL OR login ILIKE '%' || $1 || '%')
    //        OR ($2::text IS NULL OR email ILIKE '%' || $2 || '%')
    //     ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    // LIMIT $3 OFFSET $4
    // `;

    const query = `
        SELECT id, login, email, "createdAt"
        FROM "Users"
        WHERE  login ILIKE '%' || $1 || '%'
           AND email ILIKE '%' || $2 || '%'
        ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
        LIMIT $3 OFFSET $4
    `;

    const count = `
        SELECT COUNT(*) as "totalCount"
        FROM "Users"
        WHERE  login ILIKE '%' || $1 || '%'
          AND email ILIKE '%' || $2 || '%'
    `;

    const [items, totalCountResult] = await Promise.all([
      this.dataSource.query<UserViewModel[]>(query, [
        queryParams.searchLoginTerm || '',
        queryParams.searchEmailTerm || '',
        queryParams.pageSize,
        queryParams.calculateSkip(),
      ]),
      this.dataSource.query<{ totalCount: number }>(count, [
        queryParams.searchLoginTerm || '',
        queryParams.searchEmailTerm || '',
      ]),
    ]);
    const totalCount: number = parseInt(totalCountResult[0].totalCount);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}

//pagesCount: Math.ceil(totalCount / query.pageSize)

//(pageNumber - 1) * pageSize
