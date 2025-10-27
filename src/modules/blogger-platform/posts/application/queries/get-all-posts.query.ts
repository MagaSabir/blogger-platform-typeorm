import { PostQueryParams } from '../../api/input-dto/post-query-params';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/query-repository/posts.query-repository';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostViewModel } from '../view-dto/post-view-model';

export class GetAllPostsQuery {
  constructor(
    public queryParams: PostQueryParams,
    public userId: string,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler
  implements IQueryHandler<GetAllPostsQuery>
{
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(
    query: GetAllPostsQuery,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    return this.postsQueryRepository.getAllPosts(
      query.queryParams,
      query.userId,
    );
  }
}
