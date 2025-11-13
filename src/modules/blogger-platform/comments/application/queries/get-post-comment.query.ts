import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { CommentViewModel } from '../../api/view-models/comment-view-model';
import { NotFoundException } from '@nestjs/common';

export class GetPostCommentQuery {
  constructor(
    public id: number,
    public userId: number,
  ) {}
}

@QueryHandler(GetPostCommentQuery)
export class GetPostCommentQueryHandler
  implements IQueryHandler<GetPostCommentQuery>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(query: GetPostCommentQuery): Promise<CommentViewModel> {
    const comment = await this.commentsQueryRepository.getComment(
      query.id,
      query.userId,
    );
    if (!comment) throw new NotFoundException();
    return this.commentsQueryRepository.getComment(query.id, query.userId);
  }
}
