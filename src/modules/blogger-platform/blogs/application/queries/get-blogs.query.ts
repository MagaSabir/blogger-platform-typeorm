import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { BlogViewModel } from './view-dto/blog.view-model';

export class GetBlogsQuery {
  constructor(public queryParams: BlogsQueryParams) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(
    query: GetBlogsQuery,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    return this.blogsQueryRepository.getBlogs(query.queryParams);
  }
}
