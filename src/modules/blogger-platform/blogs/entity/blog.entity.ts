import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog-dto';
import { Post } from '../../posts/entity/post.entity';

@Entity('Blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ collation: 'C', type: 'varchar', length: 15 })
  public name: string;

  @Column({ type: 'varchar', length: 500 })
  public description: string;

  @Column({ type: 'varchar', length: 100 })
  public websiteUrl: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ default: false })
  public isMembership: boolean;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.blog, {
    cascade: true,
  })
  posts: Post[];

  updateBlog(dto: CreateBlogDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }

  static createBlog(dto: CreateBlogDto) {
    const blog = new Blog();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    return blog;
  }
}
