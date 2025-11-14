import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entity/post.entity';
import { Blog } from '../../blogs/entity/blog.entity';
import { PostViewModel } from '../application/view-dto/post-view-model';

export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async findPost(postId: number): Promise<Post | null> {
    return this.postRepo.findOne({ where: { id: postId } });
  }

  async save(post: Post) {
    return this.postRepo.save(post);
  }

  // async createBlogPost(
  //   dto: CreatePostByBlogId,
  //   blogId: number,
  //   blogName: string,
  // ): Promise<PostViewModel> {
  //   const result: PostViewModel[] = await this.dataSource.query(
  //     `INSERT INTO "Posts" (title, "shortDescription", content, "blogId", "blogName")
  //     VALUES  ($1, $2, $3, $4, $5)
  //     RETURNING *`,
  //     [dto.title, dto.shortDescription, dto.content, blogId, blogName],
  //   );
  //
  //   return PostViewModel.mapToView(result[0]);
  // }
  //
  // async updateBlogPost(
  //   dto: CreatePostByBlogId,
  //   postId: string,
  //   blogId: number,
  // ): Promise<void> {
  //   const query = `
  //   UPDATE "Posts"
  //   set title = $1,
  //       "shortDescription" = $2,
  //       content = $3
  //   WHERE id = $4 AND "blogId" = $5`;
  //   await this.dataSource.query(query, [
  //     dto.title,
  //     dto.shortDescription,
  //     dto.content,
  //     postId,
  //     blogId,
  //   ]);
  // }

  async deleteBlogPost(blogId: number, postId: number) {
    await this.postRepo.softDelete({ blogId, id: postId });
  }
}
