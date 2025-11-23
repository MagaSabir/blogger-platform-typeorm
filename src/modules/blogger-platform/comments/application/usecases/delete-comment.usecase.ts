import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentModelType } from '../../types/comment-model.type';
import { Comment } from '../../entity/comment.entity';

export class DeleteCommentCommand {
  constructor(
    public id: number,
    public userId: number,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment: Comment | null = await this.commentsRepository.findComment(
      command.id,
    );

    if (!comment) throw new NotFoundException();

    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }

    await this.commentsRepository.deleteComment(command.id);
  }
}
