import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user-accounts/users/entity/user.entity';
import { Session } from '../user-accounts/sessions/entity/session.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.sessionRepo.deleteAll();

    await this.userRepo.deleteAll();
  }
}
