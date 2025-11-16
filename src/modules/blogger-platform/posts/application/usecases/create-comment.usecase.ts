import { PostCommentInputDto } from '../../api/input-dto/post-comment.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../comments/infrastructure/comments.query-repository';
import { CommentViewModel } from '../../../comments/api/view-models/comment-view-model';
import { Post } from '../../entity/post.entity';
import { Comment } from '../../../comments/entity/comment.entity';

export class CreateCommentCommand {
  constructor(
    public postId: number,
    public dto: PostCommentInputDto,
    public userId: number,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private commentQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<number> {
    const { postId, dto, userId } = command;
    const post = await this.postsRepository.findPost(command.postId);

    if (!post) throw new NotFoundException();

    const comment = Comment.createComment(userId, postId, dto.content);
    const createdComment = await this.commentsRepository.save(comment);
    return createdComment.id;
  }
}
