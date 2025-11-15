import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PostQueryParams } from '../../api/input-dto/post-query-params';
import { PostViewModel } from '../../application/view-dto/post-view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { Post } from '../../entity/post.entity';
import { NotFoundException } from '@nestjs/common';
import { RawPostInterface } from '../../../blogs/types/raw-post.interface';

export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postRepo: Repository<Post>,
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
    const builder = this.postRepo
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
    const post: RawPostInterface | undefined = await builder.getRawOne();

    if (post) return PostViewModel.mapToView(post);
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

    const post: RawPostInterface | undefined = await builder.getRawOne();

    return PostViewModel.mapToView(post!);
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

    const items: PostViewModel[] = PostViewModel.mapToViewModels(posts);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
