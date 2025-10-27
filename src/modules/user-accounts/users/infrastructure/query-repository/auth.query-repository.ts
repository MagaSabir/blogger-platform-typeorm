import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewModel } from '../../api/view-dto/user-view-model';

export class AuthQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUser(userId: string) {
    const query = `SELECT id::text AS "userId", login, email FROM "Users" WHERE id = $1`;
    const result: UserViewModel[] = await this.dataSource.query(query, [
      userId,
    ]);
    return result[0];
  }
}
