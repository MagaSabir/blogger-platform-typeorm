import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserViewModel } from '../../api/view-dto/user-view-model';
import { User } from '../../entity/user.entity';

export class AuthQueryRepository {
  constructor(@InjectRepository(User) private queryRepo: Repository<User>) {}

  async getUser(userId: number): Promise<UserViewModel> {
    const user: User | null = await this.queryRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return UserViewModel.mapToViewModel(user);
  }
}
