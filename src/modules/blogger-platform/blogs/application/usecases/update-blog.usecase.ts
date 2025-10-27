import { CreateBlogInputDto } from '../../api/input-validation-dto/create-blog-input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public dto: CreateBlogInputDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlog(command.id);
    if (!blog) throw new NotFoundException();
    await this.blogsRepository.updateBlog(command.dto, command.id);
  }
}
