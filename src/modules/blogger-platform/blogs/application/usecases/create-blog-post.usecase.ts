import { CreatePostByBlogId } from '../../dto/create-post-by-blog-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
import { Post } from '../../../posts/entity/post.entity';

export class CreateBlogPostCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public id: number,
  ) {}
}

@CommandHandler(CreateBlogPostCommand)
export class CreateBlogPostUseCase
  implements ICommandHandler<CreateBlogPostCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreateBlogPostCommand): Promise<number> {
    const blog = await this.blogsRepository.findBlog(command.id);
    if (!blog) throw new NotFoundException();

    const post = Post.createPost(command.dto, blog.id);

    const createdPost = await this.postsRepository.save(post);
    return createdPost.id;
  }
}
