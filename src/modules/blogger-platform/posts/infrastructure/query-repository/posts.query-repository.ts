import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostQueryParams } from '../../api/input-dto/post-query-params';
import { PostViewModel } from '../../application/view-dto/post-view-model';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';

export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPosts(
    queryParams: PostQueryParams,
    userId: string,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    const query = `
        SELECT p.id,
               p.title,
               p."shortDescription",
               p.content,
               p."blogId",
               p."blogName",
               p."createdAt",
               JSONB_BUILD_OBJECT(
                       'likesCount', COUNT(DISTINCT pl."userId"),
                       'dislikesCount', COUNT(DISTINCT pd."userId"),
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
                                         LEFT JOIN "Users" u ON pl2."userId" = u.id),
                               '[]'
                                      )
               ) as "extendedLikesInfo"
        FROM "Posts" p
                 LEFT JOIN "PostLikes" pl ON p.id = pl."postId" AND pl.status = 'Like'
                 LEFT JOIN "PostLikes" pd ON p.id = pd."postId" AND pd.status = 'Dislike'
        GROUP BY p.id, p.title, p."shortDescription", p.content, p."blogId", p."blogName", p."createdAt"
    ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
    LIMIT $1 OFFSET $2
    `;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Posts"`,
    );
    const items: PostViewModel[] = await this.dataSource.query(query, [
      queryParams.pageSize,
      queryParams.calculateSkip(),
      userId,
    ]);
    const totalCount: number = parseInt(count[0].totalCount);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }

  async getPost(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null> {
    const query = `SELECT p.id,
                          p.title,
                          p."shortDescription",
                          p.content,
                          p."blogId",
                          p."blogName",
                          p."createdAt",
                          JSONB_BUILD_OBJECT(
                                  'likesCount', COUNT(DISTINCT pl."userId"),
                                  'dislikesCount', COUNT(DISTINCT pd."userId"),
                                  'myStatus',  COALESCE((
                                                            SELECT ps2.status
                                                            FROM "PostLikes" ps2
                                                            WHERE ps2."postId" = p.id
                                                              AND ps2."userId" = $1),'None'),
                                  'newestLikes', COALESCE((SELECT JSONB_AGG(
                                                                          JSONB_BUILD_OBJECT(
                                                                                  'addedAt', pl2."addedAt",
                                                                                  'userId', pl2."userId",
                                                                                  'login',
                                                                                  u.login --(SELECT u.login FROM "Users" u WHERE u.id = pl2."userId" )
                                                                          )
                                                                  )
                                                           FROM (SELECT "addedAt", "userId"
                                                                 FROM "PostLikes"
                                                                 WHERE "postId" = p.id
                                                                   AND status = 'Like'
                                                                 ORDER BY "addedAt" DESC
                                                                 LIMIT 3) pl2
                                                                    LEFT JOIN "Users" u ON u.id = pl2."userId"), '[]')
                          ) as "extendedLikesInfo"
                   FROM "Posts" p
                   LEFT JOIN "PostLikes" pl ON p.id = pl."postId" AND pl.status = 'Like'
                   LEFT JOIN "PostLikes" pd ON p.id = pd."postId" AND pd.status = 'Dislike'
                   WHERE p.id = $2
                   GROUP BY p.id, p.title, p."shortDescription", p.content, p."blogId", p."blogName", p."createdAt"
    `;
    const result: PostViewModel[] = await this.dataSource.query(query, [
      userId,
      postId,
    ]);
    return result[0];
  }

  async getBlogPosts(
    queryParams: PostQueryParams,
    blogId: string,
  ): Promise<BasePaginatedResponse<PostViewModel>> {
    const query = `SELECT * FROM "Posts" WHERE "blogId" = $1
                   ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
                   LIMIT $2 OFFSET $3`;

    const count: { totalCount: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as "totalCount" FROM "Posts" WHERE "blogId" = $1`,
      [blogId],
    );
    const posts: PostViewModel[] = await this.dataSource.query(query, [
      blogId,
      queryParams.pageSize,
      queryParams.calculateSkip(),
    ]);
    const totalCount: number = parseInt(count[0].totalCount);
    const items: PostViewModel[] = posts.map((p) => PostViewModel.mapToView(p));
    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items,
    };
  }
}
