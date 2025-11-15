import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../../posts/infrastructure/query-repository/posts.query-repository';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

export class GetBlogPostsQuery {
  constructor(
    public queryParams: PostQueryParams,
    public id: number,
  ) {}
}

@QueryHandler(GetBlogPostsQuery)
export class GetBlogPostsQueryHandler
  implements IQueryHandler<GetBlogPostsQuery>
{
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(
    query: GetBlogPostsQuery,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    return this.postsQueryRepository.getBlogPosts(query.queryParams, query.id);
  }
}
