import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';

export class AuthQueryRepository {
  constructor(@InjectRepository(User) private queryRepo: Repository<User>) {}

  async getUser(userId: number): Promise<User> {
    const user: User | null = await this.queryRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
