import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../../application/queries/view-dto/blog.view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { Blog } from '../../entity/blog.entity';
import { Post } from '../../../posts/entity/post.entity';
import {
  PostType,
  PostViewModel,
} from '../../../posts/application/view-dto/post-view-model';
import { PostLike } from '../../../likes/posts-likes/entity/post-likes.entity';

export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
  ) {}

  async getBlogs(
    queryParams: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    const query = this.blogRepository
      .createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.name as name',
        'b.description as description',
        'b.websiteUrl as "websiteUrl"',
        'b.createdAt as "createdAt"',
        'b.isMembership as "isMembership"',
      ])
      .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
      .offset(queryParams.calculateSkip())
      .limit(queryParams.pageSize);

    if (queryParams.searchNameTerm) {
      query.andWhere('b.name ILIKE :name', {
        name: `%${queryParams.searchNameTerm}%`,
      });
    }
    const totalCount = await query.getCount();

    const blogs: Blog[] = await query.getRawMany();

    const items: BlogViewModel[] = BlogViewModel.mapToViewModels(blogs);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getBlog(id: number) {
    const blog: Blog | undefined = await this.blogRepository
      .createQueryBuilder('u')
      .select([
        'u.id as "id"',
        'u.name as "name"',
        'u.description as "description"',
        'u.websiteUrl as "websiteUrl"',
        'u.createdAt as "createdAt"',
        'u.isMembership as "isMembership"',
      ])
      .where('u.id = :id', { id })
      .getRawOne();
    if (blog) return BlogViewModel.mapToView(blog);
  }

  async getAllPostsById(
    blogId: number,
    queryParams: PostQueryParams,
    userId: number,
  ) {
    const posts: PostType[] = await this.postRepository
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
      .where('p."blogId" = :blogId', { blogId })
      .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
      .offset(queryParams.calculateSkip())
      .limit(queryParams.pageSize)
      .getRawMany();
    const postIds = posts.map((p) => p.id);

    const likesData = await this.postLikeRepository
      .createQueryBuilder('pl')
      .select('pl.postId', 'postId')
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

    const newestLikes = await this.postLikeRepository
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
    console.log(newestLikes);

    const newestMap = {};

    for (const like of newestLikes) {
      if (!newestMap[like.postId]) newestMap[like.postId] = [];
      if (newestMap[like.postId].length < 3) {
        newestMap[like.postId].push({
          addedAt: like.addedAt,
          userId: like.userId,
          login: like.login,
        });
      }
    }

    const likesMap = {};

    for (const row of likesData) {
      likesMap[row.postId] = {
        likesCount: Number(row.likesCount),
        dislikesCount: Number(row.dislikesCount),
        myStatus: row.myStatus,
      };
    }

    const items2 = posts.map((p) => ({
      id: p.id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
      extendedLikesInfo: {
        likesCount: likesMap[p.id]?.likesCount || 0,
        dislikesCount: likesMap[p.id]?.dislikesCount || 0,
        myStatus: likesMap[p.id]?.myStatus || 'None',
        newestLikes: newestMap[p.id] || [],
      },
    }));

    console.log(items2);
    const totalCount = await this.postRepository.count({ where: { blogId } });
    const items = PostViewModel.mapToViewModels(posts);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items2,
    };
  }
}
