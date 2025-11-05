import { FindOptionsWhere, ILike } from 'typeorm';
import { User } from '../../modules/user-accounts/users/entity/user.entity';

export class PaginatedBuilder {
  static where(login?: string | null, email?: string | null) {
    const conditions: FindOptionsWhere<User>[] = [];
    if (login) {
      conditions.push({ login: ILike(`%${login}%`) });
    }
    if (email) {
      conditions.push({ email: ILike(`%${email}%`) });
    }

    return conditions.length > 0 ? conditions : undefined;
  }
}
