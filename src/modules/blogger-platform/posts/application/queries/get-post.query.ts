import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/query-repository/posts.query-repository';
import { PostViewModel } from '../view-dto/post-view-model';
import { NotFoundException } from '@nestjs/common';

export class GetPostQuery {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostQuery) {
    const result: PostViewModel | null =
      await this.postsQueryRepository.getPost(query.postId, query.userId);
    if (!result) throw new NotFoundException();

    return result;
  }
}
