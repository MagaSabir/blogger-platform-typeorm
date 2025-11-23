import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PostQueryParams } from '../../api/input-dto/post-query-params';
import {
  PostType,
  PostViewModel,
} from '../../application/view-dto/post-view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { Post } from '../../entity/post.entity';
import { NotFoundException } from '@nestjs/common';
import { RawPostInterface } from '../../../blogs/types/raw-post.interface';
import { PostLike } from '../../../likes/posts-likes/entity/post-likes.entity';
import { CommentViewModel } from '../../../comments/api/view-models/comment-view-model';

export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostLike) private postLikesRepo: Repository<PostLike>,
  ) {}

  async getAllPosts(
    queryParams: PostQueryParams,
    userId: number,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    const posts = await this.postRepo
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
      .getRawMany();
    const items = PostViewModel.mapToViewModels(posts);
    const totalCount = await this.postRepo.count();
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getPost(postId: number, userId: number) {
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

    const likesCount = await this.postLikesRepo
      .createQueryBuilder('pl')
      .where('pl.postId = :id', { postId })
      .andWhere(`pl.status = 'Like'`)
      .getCount();

    const dislikesCount = await this.postLikesRepo
      .createQueryBuilder('pl')
      .where('pl.postId = :id', { postId })
      .andWhere(`pl.status = 'Dislike'`)
      .getCount();

    const status = await this.postLikesRepo
      .createQueryBuilder('pl')
      .select(['pl.status as "myStatus"'])
      .where('l."postId" = :id', { postId })
      .where('pl.userId = :userId', { userId })
      .getRawOne();

    console.log(likesCount);
    console.log(dislikesCount);

    const newestLikes = [];

    return PostViewModel.mapToView(
      post,
      likesCount,
      dislikesCount,
      status,
      newestLikes,
    );
  }

  async getCreatedPost(postId: number): Promise<PostViewModel> {
    const builder: SelectQueryBuilder<Post> = this.postRepo
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
      .where('p.id = :postId', { postId });

    const post: PostType | undefined = await builder.getRawOne();

    return PostViewModel.mapToView(post);
  }

  async getBlogPosts(
    queryParams: PostQueryParams,
    blogId: number,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
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

    const items = PostViewModel.mapToViewModels(posts);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
