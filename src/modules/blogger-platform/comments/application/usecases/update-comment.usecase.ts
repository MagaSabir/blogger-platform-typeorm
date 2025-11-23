import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Comment } from '../../entity/comment.entity';

export class UpdateCommentCommand {
  constructor(
    public id: number,
    public content: string,
    public userId: number,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUserCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment: Comment | null = await this.commentsRepository.findComment(
      command.id,
    );

    if (!comment) throw new NotFoundException();
    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }

    comment.updateComment(command.content);
    await this.commentsRepository.save(comment);
  }
}
