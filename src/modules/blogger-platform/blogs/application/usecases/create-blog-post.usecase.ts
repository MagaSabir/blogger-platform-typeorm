import { CreatePostByBlogId } from '../../dto/create-post-by-blog-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

export class CreateBlogPostCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public id: string,
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

  async execute(command: CreateBlogPostCommand): Promise<PostViewModel> {
    const blog = await this.blogsRepository.findBlog(command.id);
    if (!blog) throw new NotFoundException();
    return this.postsRepository.createBlogPost(
      command.dto,
      command.id,
      blog.name,
    );
  }
}
