import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';

export class DeleteBlogPostCommand {
  constructor(public params: { blogId: number; postId: string }) {}
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
    console.log(blog);
    if (!blog) throw new NotFoundException();

    const post: PostViewModel | null = await this.postsRepository.findPost(
      command.params.postId,
    );
    if (!post) throw new NotFoundException();

    await this.postsRepository.deleteBlogPost(
      command.params.blogId,
      command.params.postId,
    );
    console.log(post);
  }
}
