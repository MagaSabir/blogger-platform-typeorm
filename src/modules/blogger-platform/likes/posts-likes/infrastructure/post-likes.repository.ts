import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { PostLikeType } from '../dto/post-like-type';

export class PostLikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async finUserLikeByPostId(
    id: number,
    userId: number,
  ): Promise<PostLikeType | null> {
    const result: PostLikeType[] = await this.dataSource.query(
      `
    SELECT * FROM "PostLikes" WHERE "postId" = $1 AND "userId" = $2
    `,
      [id, userId],
    );
    return result[0] ?? null;
  }

  async setPostLike(id: number, userId: number, status: LikeStatus) {
    await this.dataSource.query(
      `
    UPDATE "PostLikes" SET status = $3, "addedAt" = now() WHERE "postId" = $1 AND "userId" = $2
    `,
      [id, userId, status],
    );
  }

  async setNewPostLike(id: number, userId: number, status: LikeStatus) {
    await this.dataSource.query(
      `INSERT INTO "PostLikes" ("postId", "userId", status)
    VALUES ($1, $2, $3)`,
      [id, userId, status],
    );
  }
}
