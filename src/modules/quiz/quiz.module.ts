import { Module } from '@nestjs/common';
import { QuizAdminController } from './admin/api/quiz-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blogger-platform/blogs/entity/blog.entity';
import { Post } from '../blogger-platform/posts/entity/post.entity';
import { Comment } from '../blogger-platform/comments/entity/comment.entity';
import { PostLike } from '../blogger-platform/likes/posts-likes/entity/post-likes.entity';
import { CommentLike } from '../blogger-platform/likes/comment-likes/entity/comment-likes.entity';
import { Question } from './admin/entitys/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuizAdminController],
  providers: [],
})
export class QuizModule {}
