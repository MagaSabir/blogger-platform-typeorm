import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteBlogPostCommand {
  constructor(public params: { blogId: number; postId: number }) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostUseCase
  implements ICommandHandler<DeleteBlogPostCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: DeleteBlogPostCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlog(command.params.blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postsRepository.findPost(command.params.postId);
    if (!post) throw new NotFoundException();

    await this.postsRepository.deleteBlogPost(
      command.params.blogId,
      command.params.postId,
    );
  }
}
