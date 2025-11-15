import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { Blog } from '../../entity/blog.entity';

export class DeleteBlogCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog: Blog | null = await this.blogsRepository.findBlog(command.id);
    console.log(blog);
    if (!blog) throw new NotFoundException();

    await this.blogsRepository.deleteBlog(command.id);
  }
}
