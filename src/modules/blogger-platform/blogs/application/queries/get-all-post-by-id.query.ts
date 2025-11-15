import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query-repository/blogs.query-repository';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

export class GetAllPostByIdQuery {
  constructor(
    public id: number,
    public queryParams: PostQueryParams,
    public userId: number,
  ) {}
}

@QueryHandler(GetAllPostByIdQuery)
export class GetAllPostByIdQueryHandler
  implements IQueryHandler<GetAllPostByIdQuery>
{
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(
    query: GetAllPostByIdQuery,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    return this.blogsQueryRepository.getAllPostsById(
      query.id,
      query.queryParams,
      query.userId,
    );
  }
}
