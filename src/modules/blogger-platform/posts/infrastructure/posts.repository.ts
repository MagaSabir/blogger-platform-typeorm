import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePostByBlogId } from '../../blogs/dto/create-post-by-blog-id.dto';
import { PostViewModel } from '../application/view-dto/post-view-model';

export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findPost(postId: string): Promise<PostViewModel | null> {
    const result: PostViewModel[] = await this.dataSource.query(
      `SELECT * FROM "Posts" WHERE id = $1`,
      [postId],
    );
    return result[0] ?? null;
  }

  async createBlogPost(
    dto: CreatePostByBlogId,
    blogId: number,
    blogName: string,
  ): Promise<PostViewModel> {
    const result: PostViewModel[] = await this.dataSource.query(
      `INSERT INTO "Posts" (title, "shortDescription", content, "blogId", "blogName")
      VALUES  ($1, $2, $3, $4, $5)
      RETURNING *`,
      [dto.title, dto.shortDescription, dto.content, blogId, blogName],
    );

    return PostViewModel.mapToView(result[0]);
  }

  async updateBlogPost(
    dto: CreatePostByBlogId,
    postId: string,
    blogId: number,
  ): Promise<void> {
    const query = `
    UPDATE "Posts" 
    set title = $1,
        "shortDescription" = $2,
        content = $3
    WHERE id = $4 AND "blogId" = $5`;
    await this.dataSource.query(query, [
      dto.title,
      dto.shortDescription,
      dto.content,
      postId,
      blogId,
    ]);
  }

  async deleteBlogPost(blogId: number, postId: string) {
    await this.dataSource.query(
      `DELETE FROM "Posts" WHERE "id" = $1 AND "blogId" = $2`,
      [postId, blogId],
    );
  }
}
