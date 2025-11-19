import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CommentMapper,
  CommentViewModel,
  DbCommentModel,
} from '../api/view-models/comment-view-model';
import { CommentQueryParams } from '../input-dto/comment-query-params';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { NotFoundException } from '@nestjs/common';
import { Comment } from '../entity/comment.entity';
import { CommentLike } from '../../likes/comment-likes/entity/comment-likes.entity';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';

export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async getComment(
    id: number,
    userId?: number,
  ): Promise<CommentViewModel | null> {
    const comment: DbCommentModel | undefined = await this.commentRepo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .select([
        'c.id as id',
        'c.content as content',
        'c."createdAt" as "createdAt"',
        'u.login as "userLogin"',
        'u.id as "userId"',
      ])
      .where('c.id =:id', { id })
      .getRawOne();

    if (!comment) return null;

    const likesCount = await this.dataSource
      .getRepository(CommentLike)
      .createQueryBuilder('l')
      .where('l."commentId" = :id', { id })
      .andWhere("l.status = 'Like'")
      .getCount();

    const dislikesCount = await this.dataSource
      .getRepository(CommentLike)
      .createQueryBuilder('l')
      .where('l."commentId" = :id', { id })
      .andWhere("l.status = 'Dislike'")
      .getCount();

    const status: { myStatus: LikeStatus } | undefined = await this.dataSource
      .getRepository(CommentLike)
      .createQueryBuilder('l')
      .select(['l.status as "myStatus"'])
      .where('l."commentId" = :id', { id })
      .andWhere('l."userId" = :userId', { userId })
      .getRawOne();

    const myStatus: LikeStatus | undefined = status?.myStatus;

    return CommentMapper.toViewModel(
      comment,
      likesCount,
      dislikesCount,
      myStatus,
    );
  }

  async getComments(
    queryParams: CommentQueryParams,
    postId: string,
    userId?: string,
  ): Promise<BasePaginatedResponse<CommentViewModel>> {
    const query = `
    SELECT ps.id,
               ps.content,
               JSONB_BUILD_OBJECT(
                       'userId', ps."userId",
                       'userLogin', u.login
               ) as "commentatorInfo",
               ps."createdAt",
               JSON_BUILD_OBJECT(
                       'likesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Like'),
                       'dislikesCount',
                       (SELECT COUNT(*) FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c.status = 'Dislike'),
                       'myStatus',
                       COALESCE((SELECT c.status FROM "CommentLikes" c WHERE ps.id = c."commentId" AND c."userId" = $1),
                                'None')
               ) as "likesInfo"
        FROM "Comments" ps
                 LEFT JOIN "Users" u ON u.id = ps."userId"
    WHERE ps."postId" = $4
    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    LIMIT $2 OFFSET $3
    `;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Comments" WHERE "postId" = $1`,
      [postId],
    );

    const items: CommentViewModel[] = await this.dataSource.query(query, [
      userId,
      queryParams.pageSize,
      queryParams.calculateSkip(),
      postId,
    ]);
    const totalCount: number = parseInt(count[0].totalCount);
    if (items.length === 0) throw new NotFoundException();

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
