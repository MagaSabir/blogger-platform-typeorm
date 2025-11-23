import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../../comments/infrastructure/comments.query-repository';
import { CommentViewModel } from '../../../comments/api/view-models/comment-view-model';
import { CommentQueryParams } from '../../../comments/input-dto/comment-query-params';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { NotFoundException } from '@nestjs/common';

export class GetPostCommentsQuery {
  constructor(
    public userId: number,
    public id: number,
    public queryParams: CommentQueryParams,
  ) {}
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler
  implements IQueryHandler<GetPostCommentsQuery>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(
    query: GetPostCommentsQuery,
  ): Promise<BasePaginatedResponse<CommentViewModel> | null> {
    const comments = await this.commentsQueryRepository.getComments(
      query.queryParams,
      query.id,
      query.userId,
    );
    if (!comments) throw new NotFoundException();
    return comments;
  }
}
