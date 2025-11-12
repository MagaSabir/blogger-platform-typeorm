import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../entity/blog.entity';

export class BlogsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
  ) {}

  async findBlog(id: number): Promise<Blog | null> {
    return this.blogRepo.findOne({ where: { id } });
  }

  async save(blog: Blog): Promise<Blog> {
    return this.blogRepo.save(blog);
  }

  // async updateBlog(dto: CreateBlogInputDto, id: string) {
  //   const query = `UPDATE "Blogs"
  //   set name = $1,
  //       description = $2,
  //       "websiteUrl" = $3
  //   WHERE id = $4`;
  //   await this.dataSource.query(query, [
  //     dto.name,
  //     dto.description,
  //     dto.websiteUrl,
  //     id,
  //   ]);
  // }

  async deleteBlog(id: number) {
    await this.blogRepo.softDelete(id);
  }
}
