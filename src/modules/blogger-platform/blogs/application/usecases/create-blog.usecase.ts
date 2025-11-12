import { CreateBlogInputDto } from '../../api/input-validation-dto/create-blog-input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogViewModel } from '../queries/view-dto/blog.view-model';
import { Blog } from '../../entity/blog.entity';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<number> {
    const blog = Blog.createBlog(command.dto);
    const createdBlo = await this.blogsRepository.save(blog);
    return createdBlo.id;
  }
}
