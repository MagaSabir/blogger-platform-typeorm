import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entity/user.entity';

export class UserViewModel {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
  })
  id: string;

  @ApiProperty({ example: 'john_doe', description: 'Логин пользователя' })
  login: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: '2025-10-20T12:00:00Z',
    description: 'Дата создания',
  })
  createdAt: string;

  static mapToViewModel(user: User): UserViewModel {
    const userViewModel = new UserViewModel();
    userViewModel.id = user.id.toString();
    userViewModel.login = user.login;
    userViewModel.email = user.email;
    userViewModel.createdAt = user.createdAt.toISOString();
    return userViewModel;
  }

  static mapToViewModels(users: User[]) {
    return users.map((u) => this.mapToViewModel(u));
  }
}
