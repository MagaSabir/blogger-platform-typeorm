import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { BlogViewModel } from '../../application/queries/view-dto/blog.view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { PostQueryParams } from '../../../posts/api/input-dto/post-query-params';
import { PostViewModel } from '../../../posts/application/view-dto/post-view-model';

export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBlogs(
    queryParams: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewModel>> {
    const query = `SELECT * FROM "Blogs"
                    WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
                    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
                    LIMIT $2 OFFSET $3`;

    const count = `
    SELECT COUNT(*) as "totalCount" FROM "Blogs" WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')`;

    const [items, totalCountResult] = await Promise.all([
      this.dataSource.query<BlogViewModel[]>(query, [
        queryParams.searchNameTerm,
        queryParams.pageSize,
        queryParams.calculateSkip(),
      ]),
      this.dataSource.query<{ totalCount: string }[]>(count, [
        queryParams.searchNameTerm,
      ]),
    ]);

    const totalCount: number = parseInt(totalCountResult[0].totalCount);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getBlog(id: string): Promise<BlogViewModel> {
    const query = `SELECT * FROM "Blogs" WHERE id = $1`;
    const result: BlogViewModel[] = await this.dataSource.query(query, [id]);
    return result[0] ?? null;
  }

  async getAllPostsById(
    id: string,
    queryParams: PostQueryParams,
    userId: string,
  ) {
    const query = `SELECT p.id,
               p.title,
               p."shortDescription",
               p.content,
               p."blogId",
               p."blogName",
               p."createdAt",
               JSONB_BUILD_OBJECT(
                       'likesCount', (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p.id AND status = 'Like'),
                       'dislikesCount', (SELECT COUNT(*) FROM "PostLikes" WHERE "postId" = p.id AND status = 'Dislike'),
                       'myStatus',  COALESCE((
                                    SELECT ps2.status
                                    FROM "PostLikes" ps2
                                    WHERE ps2."postId" = p.id
                                      AND ps2."userId" = $3),'None'),
                       'newestLikes', COALESCE(
                               (SELECT JSONB_AGG(
                                               JSONB_BUILD_OBJECT(
                                                       'addedAt', pl2."addedAt",
                                                       'userId', pl2."userId",
                                                       'login', u.login
                                               )
                                       )
                                FROM (SELECT "addedAt", "userId"
                                      FROM "PostLikes"
                                      WHERE "postId" = p.id
                                        AND status = 'Like'
                                      ORDER BY "addedAt" DESC
                                      LIMIT 3) pl2
                                         LEFT JOIN "Users" u ON pl2."userId" = u.id),'[]'
                )
               ) as "extendedLikesInfo"
        FROM "Posts" p
        WHERE p."blogId" = $4
    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    LIMIT $1 OFFSET $2`;
    const items: PostViewModel[] = await this.dataSource.query(query, [
      queryParams.pageSize,
      queryParams.calculateSkip(),
      userId,
      id,
    ]);
    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Posts" WHERE "blogId" = $1`,
      [id],
    );

    const totalCount: number = parseInt(count[0].totalCount);
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
