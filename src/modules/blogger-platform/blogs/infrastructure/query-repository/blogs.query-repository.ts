import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../../application/queries/view-dto/blog.view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { Blog } from '../../entity/blog.entity';
import { Post } from '../../../posts/entity/post.entity';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';
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
    const query = await this.postRepository
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
      .addSelect(
        `(SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p.id AND status = 'Like')`,
        'likesCount',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p.id AND status = 'Dislike')`,
        'dislikesCount',
      )
      .addSelect(
        `COALESCE((SELECT pl.status FROM "PostLikes" pl WHERE pl."postId" = p.id 
        AND pl."userId" = ${userId}),'None')`,
        'myStatus',
      )
      .addSelect(
        `(
    SELECT COALESCE(
      json_agg(
        json_build_object(
          'addedAt', t."addedAt",
          'userId', t."userId",
          'login', t.login
        )
      ),
      '[]'::json
    )
    FROM (
      SELECT pl."addedAt",
             pl."userId",
             u.login
      FROM "PostLikes" pl
      LEFT JOIN "Users" u ON u.id = pl."userId"
      WHERE pl."postId" = p.id 
        AND pl.status = 'Like'
      ORDER BY pl."addedAt" DESC
      LIMIT 3
    ) AS t
  )`,
        'newestLikes',
      )

      .where('p."blogId" = :blogId', { blogId })
      .orderBy({ [`"${queryParams.sortBy}"`]: queryParams.sortDirection })
      .offset(queryParams.calculateSkip())
      .limit(queryParams.pageSize)
      .getRawMany();

    console.log(query);

    const totalCount = await this.postRepository.count({ where: { blogId } });
    const items = PostViewModel.mapToViewModels(query);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
