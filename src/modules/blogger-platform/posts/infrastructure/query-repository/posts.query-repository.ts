import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostQueryParams } from '../../api/input-dto/post-query-params';
import {
  LikeDataType,
  NewestLikeType,
  PostType,
  PostViewModel,
} from '../../application/view-dto/post-view-model';
import { Post } from '../../entity/post.entity';
import { PostLike } from '../../../likes/posts-likes/entity/post-likes.entity';
import { LikesDataRow } from '../../../../../core/utils/likes-map.util';

export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostLike) private postLikesRepo: Repository<PostLike>,
  ) {}

  async getAllPosts(queryParams: PostQueryParams, userId: number) {
    const [posts, totalCount] = await Promise.all([
      this.postRepo
        .createQueryBuilder('p')
        .leftJoin('p.blog', 'b')
        .select([
          'p.id AS id',
          'p.title AS title',
          'p."shortDescription" AS "shortDescription"',
          'p.content AS content',
          'p."blogId" AS "blogId"',
          'b.name AS "blogName"',
          'p.createdAt AS "createdAt"',
        ])
        .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
        .offset(queryParams.calculateSkip())
        .limit(queryParams.pageSize)
        .getRawMany(),

      this.postRepo.count(),
    ]);
    if (posts.length === 0) return null;
    const postIds = posts.map((p: PostType) => p.id);

    const likeData: LikesDataRow[] | undefined = await this.postLikesRepo
      .createQueryBuilder('pl')
      .select('pl.postId', 'id')
      .addSelect(`COUNT(pl.id) FILTER (WHERE pl.status = 'Like')`, 'likesCount')
      .addSelect(
        `COUNT(pl.id) FILTER (WHERE pl.status = 'Dislike')`,
        'dislikesCount',
      )
      .addSelect(
        `COALESCE(MAX(CASE WHEN pl.userId = :userId THEN pl.status ELSE NULL END), 'None')`,
        'myStatus',
      )
      .where('pl.postId IN (:...ids)', { ids: postIds })
      .setParameter('userId', userId)
      .groupBy('pl.postId')
      .getRawMany();

    const newestLikes = await this.postLikesRepo
      .createQueryBuilder('pl')
      .select([
        `pl.postId as "postId"`,
        `pl.addedAt as "addedAt"`,
        `pl.userId as "userId"`,
        'u.login as login',
      ])
      .leftJoin('Users', 'u', 'u.id = pl.userId')
      .where('pl.postId IN (:...ids)', { ids: postIds })
      .andWhere(`pl.status = 'Like'`)
      .orderBy('pl.addedAt', 'DESC')
      .getRawMany();

    const items = PostViewModel.toViewModel(posts, likeData, newestLikes);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getPost(
    postId: number,
    userId?: number,
  ): Promise<PostViewModel | null> {
    const post: PostType | undefined = await this.postRepo
      .createQueryBuilder('p')
      .leftJoin('p.blog', 'b')
      .select([
        'p.id AS id',
        'p.title AS title',
        'p."shortDescription" AS "shortDescription"',
        'p.content AS content',
        'p."blogId" AS "blogId"',
        'b.name AS "blogName"',
        'p.createdAt AS "createdAt"',
      ])
      .where('p.id = :postId', { postId })
      .getRawOne();

    if (!post) return null;

    // const likesCount = await this.postLikesRepo
    //   .createQueryBuilder('pl')
    //   .where('pl.postId = :postId', { postId })
    //   .andWhere(`pl.status = 'Like'`)
    //   .getCount();
    //
    // const dislikesCount = await this.postLikesRepo
    //   .createQueryBuilder('pl')
    //   .where('pl.postId = :postId', { postId })
    //   .andWhere(`pl.status = 'Dislike'`)
    //   .getCount();
    //
    // const status = await this.postLikesRepo
    //   .createQueryBuilder('pl')
    //   .select(['pl.status as "myStatus"'])
    //   .where('pl.postId = :postId', { postId })
    //   .andWhere('pl.userId = :userId', { userId })
    //   .getRawOne();
    //
    const newestLikes: NewestLikeType[] | undefined = await this.postLikesRepo
      .createQueryBuilder('pl')
      .select([
        `pl.addedAt as "addedAt"`,
        `pl.userId as "userId"`,
        'u.login as login',
      ])
      .leftJoin('Users', 'u', 'u.id = pl.userId')
      .where('pl.postId = :postId', { postId })
      .andWhere(`pl.status = 'Like'`)
      .orderBy('pl.addedAt', 'DESC')
      .limit(3)
      .getRawMany();

    const likesData: LikeDataType | undefined = await this.postLikesRepo
      .createQueryBuilder('pl')
      .select([
        `COUNT(pl.id) FILTER (where pl.status = 'Like')::int as "likesCount"`,
        `COUNT(pl.id) FILTER (where pl.status = 'Dislike')::int as "dislikesCount"`,
        `COALESCE(MAX(CASE WHEN pl.userId = :userId THEN pl.status END), 'None') as "myStatus"`,
      ])
      .where('pl.postId = :postId', { postId })
      .setParameter('userId', userId ?? null)
      .getRawOne();

    return PostViewModel.mapToView(post, likesData, newestLikes);
  }

  async getBlogPosts(queryParams: PostQueryParams, blogId: number) {
    const query = this.postRepo
      .createQueryBuilder('p')
      .leftJoin('p.blog', 'b')
      .select([
        'p.id AS id',
        'p.title AS title',
        'p."shortDescription" AS "shortDescription"',
        'p.content AS content',
        'p.blogId AS "blogId"',
        'b.name AS "blogName"',
        'p.createdAt AS "createdAt"',
      ])
      .where('p.blogId = :blogId', { blogId })
      .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
      .offset(queryParams.calculateSkip())
      .limit(queryParams.pageSize);

    const totalCount = await query.getCount();
    const posts = await query.getRawMany();

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      posts,
    };
  }
}
