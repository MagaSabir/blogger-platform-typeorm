import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';
import { NotFoundException } from '@nestjs/common';

export class GetBlogQuery {
  constructor(public id: number) {}
}

@QueryHandler(GetBlogQuery)
export class GetBlogQueryHandler implements IQueryHandler<GetBlogQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: GetBlogQuery) {
    const result = await this.blogsQueryRepository.getBlog(query.id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
