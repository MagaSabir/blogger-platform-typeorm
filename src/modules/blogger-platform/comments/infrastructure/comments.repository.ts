import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentViewModel } from '../api/view-models/comment-view-model';
import { CommentModelType } from '../types/comment-model.type';
import { Comment } from '../entity/comment.entity';

export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async updateComment(commentId: string, content: string) {
    await this.dataSource.query(
      `
    UPDATE "Comments" SET content = $1 WHERE id = $2
    `,
      [content, commentId],
    );
  }

  async deleteComment(commentId: string) {
    await this.dataSource.query(
      `
    DELETE FROM "Comments" WHERE id = $1
    `,
      [commentId],
    );
  }

  async save(comment: Comment) {
    return this.commentRepo.save(comment);
  }
  async createComment(
    content: string,
    postId: number,
    userId: number,
  ): Promise<number> {
    const result: [{ id: number }] = await this.dataSource.query(
      `
    INSERT INTO "Comments" (content, "postId", "userId")
    VALUES ($1, $2, $3)
    RETURNING id
    `,
      [content, postId, userId],
    );

    return result[0].id;
  }

  async findComment(id: string): Promise<CommentModelType | null> {
    const result: CommentModelType[] = await this.dataSource.query(
      `SELECT * FROM "Comments" WHERE id = $1`,
      [id],
    );
    return result[0] ?? null;
  }
}
