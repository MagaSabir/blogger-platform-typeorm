import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { PostLikesRepository } from '../../../likes/posts-likes/infrastructure/post-likes.repository';
import { PostLikeType } from '../../../likes/posts-likes/dto/post-like-type';
import { LikeStatus } from '../view-dto/post-view-model';

export class PostSetLikeCommand {
  constructor(
    public id: string,
    public status: LikeStatus,
    public userId: string,
  ) {}
}

@CommandHandler(PostSetLikeCommand)
export class PostSetLikeUseCase implements ICommandHandler<PostSetLikeCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: PostLikesRepository,
  ) {}
  async execute(command: PostSetLikeCommand) {
    const post = await this.postsRepository.findPost(command.id);

    if (!post) throw new NotFoundException();

    const existing: PostLikeType | null =
      await this.likesRepository.finUserLikeByPostId(
        command.id,
        command.userId,
      );

    if (existing) {
      if (existing.status !== command.status) {
        await this.likesRepository.setPostLike(
          command.id,
          command.userId,
          command.status,
        );
      }
    } else {
      await this.likesRepository.setNewPostLike(
        command.id,
        command.userId,
        command.status,
      );
    }
  }
}
