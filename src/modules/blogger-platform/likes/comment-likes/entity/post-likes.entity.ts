import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../../user-accounts/users/entity/user.entity';
import { Post } from '../../../posts/entity/post.entity';
import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';

@Entity('PostLikes')
export class PostLike {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @Column({ type: 'enum', enum: LikeStatus })
  public status: LikeStatus;

  @CreateDateColumn()
  public addedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;
}
