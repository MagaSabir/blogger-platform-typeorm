import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
import { PostsQueryRepository } from '../../../posts/infrastructure/query-repository/posts.query-repository';

export class GetBlogPostQuery {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetBlogPostQuery)
export class GetBlogPostQueryHandler
  implements IQueryHandler<GetBlogPostQuery>
{
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetBlogPostQuery) {
    const result: PostViewModel | null =
      await this.postsQueryRepository.getPost(query.postId, query.userId);
    if (!result) throw new NotFoundException();

    return result;
  }
}
