import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/entity/blog.entity';
import { CreatePostByBlogId } from '../../blogs/dto/create-post-by-blog-id.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostLike } from '../../likes/posts-likes/entity/post-likes.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 30 })
  public title: string;

  @Column({ type: 'varchar', length: 100 })
  public shortDescription: string;

  @Column({ type: 'text' })
  public content: string;

  @CreateDateColumn()
  public createdAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @Column()
  public blogId: number;

  @OneToMany(() => PostLike, (pl) => pl.post)
  likes: PostLike[];

  updatePost(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
  }

  static createPost(dto: UpdatePostDto, blogId: number) {
    const post = new Post();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId;
    return post;
  }
}
