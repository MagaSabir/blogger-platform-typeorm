import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';

export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async deleteComment(commentId: number) {
    await this.commentRepo.softDelete(commentId);
  }

  async save(comment: Comment) {
    return this.commentRepo.save(comment);
  }

  async findComment(id: number): Promise<Comment | null> {
    return this.commentRepo.findOne({ where: { id } });
  }
}
