import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user-accounts/users/entity/user.entity';
import { Session } from '../user-accounts/sessions/entity/session.entity';
import { Post } from '../blogger-platform/posts/entity/post.entity';
import { Blog } from '../blogger-platform/blogs/entity/blog.entity';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.dataSource.query(`
  TRUNCATE TABLE "Sessions", "Posts", "Blogs", "Users" RESTART IDENTITY CASCADE
`);
  }
}
