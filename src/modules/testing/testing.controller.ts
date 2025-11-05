import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user-accounts/users/entity/user.entity';

@Controller('testing')
export class TestingController {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.repo.deleteAll();
  }
}
