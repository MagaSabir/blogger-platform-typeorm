import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from './password.service';
import { UserDbModel } from '../../api/view-dto/user-db-model';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async validateUser(loginOrEmail: string, password: string) {
    const user: UserDbModel | null =
      await this.userRepository.findUserByLoginOrEmailForAuth(loginOrEmail);
    if (!user) {
      return null;
    }

    const hash = user.passwordHash;
    const isPasswordValid = await this.passwordService.compare(password, hash);

    if (!isPasswordValid) {
      return null;
    }

    return { id: user.id };
  }
}
