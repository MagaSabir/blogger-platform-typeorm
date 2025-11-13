import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user-accounts/users/entity/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { Session } from '../user-accounts/sessions/entity/session.entity';
import { Blog } from '../blogger-platform/blogs/entity/blog.entity';
import { Post } from '../blogger-platform/posts/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Blog, Post]), CqrsModule],

  controllers: [TestingController],
})
export class TestingModule {}
