import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entity/user.entity';

export class MeViewModel {
  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    description: 'email',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    example: 'login',
    description: 'login',
  })
  login: string;
  @ApiProperty({
    type: 'string',
    example: 'password123',
    description: 'password',
  })
  userId: string;

  static meMapToViewModel(user: User): MeViewModel {
    const userViewModel = new MeViewModel();
    userViewModel.userId = user.id.toString();
    userViewModel.login = user.login;
    userViewModel.email = user.email;
    return userViewModel;
  }
}
