import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CommentViewModel,
  DbCommentModel,
} from '../api/view-models/comment-view-model';
import { CommentQueryParams } from '../input-dto/comment-query-params';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { Comment } from '../entity/comment.entity';
import { CommentLike } from '../../likes/comment-likes/entity/comment-likes.entity';
import { LikeStatus } from '../../posts/application/view-dto/post-view-model';

export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikestRepo: Repository<CommentLike>,
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

    return CommentViewModel.toViewModel(
      comment,
      likesCount,
      dislikesCount,
      myStatus,
    );
  }

  async getComments(
    queryParams: CommentQueryParams,
    postId: number,
    userId?: number,
  ): Promise<BasePaginatedResponse<CommentViewModel> | null> {
    const [comments, totalCount] = await Promise.all([
      this.commentRepo
        .createQueryBuilder('c')
        .leftJoin('c.user', 'u')
        .select([
          'c.id as id',
          'c.content as content',
          'c."createdAt" as "createdAt"',
          'u.login as "userLogin"',
          'u.id as "userId"',
        ])
        .where('c.postId =:postId', { postId })
        .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
        .offset(queryParams.calculateSkip())
        .limit(queryParams.pageSize)
        .getRawMany(),

      this.commentRepo.count({ where: { postId } }),
    ]);
    if (comments.length === 0) return null;

    const commentIds = comments.map((c: DbCommentModel) => c.id);

    const likeData = await this.commentLikestRepo
      .createQueryBuilder('cl')
      .select('cl.commentId', 'id')
      .addSelect(`COUNT(cl.id) FILTER (WHERE cl.status = 'Like')`, 'likesCount')
      .addSelect(
        `COUNT(cl.id) FILTER (WHERE cl.status = 'Dislike')`,
        'dislikesCount',
      )
      .addSelect(
        `COALESCE(MAX(CASE WHEN cl.userId = :userId THEN cl.status ELSE NULL END), 'None')`,
        'myStatus',
      )
      .where('cl.commentId IN (:...ids)', { ids: commentIds })
      .setParameter('userId', userId)
      .groupBy('cl.commentId')
      .getRawMany();

    const items: CommentViewModel[] = CommentViewModel.toViewModelComments(
      comments,
      likeData,
    );

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
