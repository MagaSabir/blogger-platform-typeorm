import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { GetBlogQueryHandler } from './blogs/application/queries/get-blog.query';
import { GetBlogsQueryHandler } from './blogs/application/queries/get-blogs.query';
import { BlogsQueryRepository } from './blogs/infrastructure/query-repository/blogs.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/query-repository/posts.query-repository';
import { GetAllPostByIdQueryHandler } from './blogs/application/queries/get-all-post-by-id.query';
import { GetAllPostsQueryHandler } from './posts/application/queries/get-all-posts.query';
import { GetPostQueryHandler } from './posts/application/queries/get-post.query';
import { SaBlogsController } from './blogs/api/admin/sa.blogs.controller';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { UpdateBlogPostUseCase } from './blogs/application/usecases/update-blog-post-use.case';
import { GetBlogPostsQueryHandler } from './blogs/application/queries/get-blog-posts.query';
import { DeleteBlogPostUseCase } from './blogs/application/usecases/delete-blog-post.usecase';
import { CreateBlogPostUseCase } from './blogs/application/usecases/create-blog-post.usecase';
import { PostSetLikeUseCase } from './posts/application/usecases/post.set-like.usecase';
import { PostLikesRepository } from './likes/posts-likes/infrastructure/post-likes.repository';
import { CreateCommentUseCase } from './posts/application/usecases/create-comment.usecase';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { GetPostCommentQueryHandler } from './comments/application/queries/get-post-comment.query';
import { CommentsController } from './comments/api/comments.controller';
import { GetPostCommentsQueryHandler } from './posts/application/queries/get-post-comments.query';
import { UpdateCommentUserCase } from './comments/application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { CommentLikesRepository } from './likes/comment-likes/infrastructure/comment-likes.repository';
import { CommentSetLikeUseCase } from './comments/application/usecases/comment-set-like-use.case';

const commandHandlers = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreateBlogPostUseCase,
  UpdateBlogPostUseCase,
  DeleteBlogPostUseCase,
  PostSetLikeUseCase,
  CreateCommentUseCase,
  UpdateCommentUserCase,
  DeleteCommentUseCase,
  CommentSetLikeUseCase,
];
const queryHandlers = [
  GetBlogQueryHandler,
  GetBlogsQueryHandler,
  GetAllPostByIdQueryHandler,
  GetAllPostsQueryHandler,
  GetPostQueryHandler,
  GetBlogPostsQueryHandler,
  GetPostCommentQueryHandler,
  GetPostCommentsQueryHandler,
];
@Module({
  imports: [CqrsModule],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    BlogsQueryRepository,
    BlogsRepository,
    PostsQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostLikesRepository,
    CommentsQueryRepository,
    CommentsRepository,
    CommentLikesRepository,
  ],
  controllers: [
    BlogsController,
    PostsController,
    SaBlogsController,
    CommentsController,
  ],
})
export class BloggerPlatformModule {}
