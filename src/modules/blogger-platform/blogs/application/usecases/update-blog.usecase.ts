import { CreateBlogInputDto } from '../../api/input-validation-dto/create-blog-input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { Blog } from '../../entity/blog.entity';

export class UpdateBlogCommand {
  constructor(
    public dto: CreateBlogInputDto,
    public id: number,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog: Blog | null = await this.blogsRepository.findBlog(command.id);
    if (!blog) throw new NotFoundException();
    blog.updateBlog(command.dto);
    await this.blogsRepository.save(blog);
  }
}
