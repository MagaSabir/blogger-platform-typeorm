import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikeType } from '../../posts-likes/dto/post-like-type';
import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { CommentLikeType } from '../dto/comment-like-type';

export class CommentLikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async finUserLikeById(
    id: string,
    userId: string,
  ): Promise<CommentLikeType | null> {
    const result: CommentLikeType[] = await this.dataSource.query(
      `
    SELECT * FROM "CommentLikes" WHERE "commentId" = $1 AND "userId" = $2
    `,
      [id, userId],
    );
    return result[0] ?? null;
  }

  async setCommentLike(id: string, userId: string, status: LikeStatus) {
    await this.dataSource.query(
      `
    UPDATE "CommentLikes" SET status = $3, "addedAt" = now() WHERE "commentId" = $1 AND "userId" = $2
    `,
      [id, userId, status],
    );
  }

  async setNewCommentLike(id: string, userId: string, status: LikeStatus) {
    await this.dataSource.query(
      `INSERT INTO "CommentLikes" ("commentId", "userId", status)
    VALUES ($1, $2, $3)`,
      [id, userId, status],
    );
  }
}
