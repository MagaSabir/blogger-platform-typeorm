import { CreatePostByBlogId } from '../../dto/create-post-by-blog-id.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

export class UpdateBlogPostCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public params: { blogId: string; postId: string },
  ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostUseCase
  implements ICommandHandler<UpdateBlogPostCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: UpdateBlogPostCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlog(command.params.blogId);
    const post: PostViewModel | null = await this.postsRepository.findPost(
      command.params.postId,
    );
    if (!blog) throw new NotFoundException();
    if (!post) throw new NotFoundException();

    return this.postsRepository.updateBlogPost(
      command.dto,
      command.params.postId,
      blog.id,
    );
  }
}
