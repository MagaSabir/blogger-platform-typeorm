import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
import { PostsQueryRepository } from '../../../posts/infrastructure/query-repository/posts.query-repository';
import { Post } from '../../../posts/entity/post.entity';

export class GetBlogPostQuery {
  constructor(public postId: number) {}
}

@QueryHandler(GetBlogPostQuery)
export class GetBlogPostQueryHandler
  implements IQueryHandler<GetBlogPostQuery>
{
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetBlogPostQuery) {
    const result: PostViewModel =
      await this.postsQueryRepository.getCreatedPost(query.postId);
    if (!result) throw new NotFoundException();

    return result;
  }
}
