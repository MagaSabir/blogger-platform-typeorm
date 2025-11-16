import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entity/post.entity';
import { User } from '../../../user-accounts/users/entity/user.entity';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 301 })
  public content: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  public postId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  public userId: number;

  @CreateDateColumn()
  public createdAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  static createComment(userId: number, postId: number, content: string) {
    const comment = new Comment();
    comment.content = content;
    comment.postId = postId;
    comment.userId = userId;
    return comment;
  }
}
