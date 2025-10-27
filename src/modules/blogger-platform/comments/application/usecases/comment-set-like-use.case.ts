import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentLikesRepository } from '../../../likes/comment-likes/infrastructure/comment-likes.repository';
import { CommentViewModel } from '../../api/view-models/comment-view-model';
import { NotFoundException } from '@nestjs/common';
import { CommentLikeType } from '../../../likes/comment-likes/dto/comment-like-type';
import { CommentModelType } from '../../types/comment-model.type';

export class CommentSetLikeCommand {
  constructor(
    public id: string,
    public status: LikeStatus,
    public userId: string,
  ) {}
}

@CommandHandler(CommentSetLikeCommand)
export class CommentSetLikeUseCase
  implements ICommandHandler<CommentSetLikeCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private commentLikesRepository: CommentLikesRepository,
  ) {}

  async execute(command: CommentSetLikeCommand): Promise<void> {
    const comment: CommentModelType | null =
      await this.commentsRepository.findComment(command.id);

    if (!comment) throw new NotFoundException();

    const existing: CommentLikeType | null =
      await this.commentLikesRepository.finUserLikeById(
        command.id,
        command.userId,
      );

    if (existing) {
      if (existing.status !== command.status) {
        await this.commentLikesRepository.setCommentLike(
          command.id,
          command.userId,
          command.status,
        );
      }
    } else {
      await this.commentLikesRepository.setNewCommentLike(
        command.id,
        command.userId,
        command.status,
      );
    }
  }
}
