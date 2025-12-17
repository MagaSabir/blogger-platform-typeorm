import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameQuestion } from './game-question.entity';
import { DomainException } from '../../../core/exceptions/domain.exceptions';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception-codes';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public body: string;

  @Column({ type: 'text', array: true })
  public correctAnswers: string[];

  @Column({ default: false })
  public published: boolean;

  @OneToMany(() => GameQuestion, (gq) => gq.question)
  gameQuestions: GameQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  updateQuestion(body: string, correctAnswers: string[]) {
    if (this.published) {
      throw new DomainException({
        code: DomainExceptionCodes.BadRequest,
        message: 'Published question cannot be update',
      });
    }
    this.body = body;
    this.correctAnswers = correctAnswers;
  }

  publish() {
    if (this.published) {
      throw new DomainException({
        code: DomainExceptionCodes.BadRequest,
        message: 'Question already publish',
      });
    }
    this.published = true;
  }

  unpublish() {
    if (!this.published) {
      throw new DomainException({
        code: DomainExceptionCodes.BadRequest,
        message: 'Question already publish',
      });
    }
    this.published = false;
  }
  static createQuestion(body: string, correctAnswers: string[]) {
    const question = new Question();
    question.body = body;
    question.correctAnswers = correctAnswers;
    return question;
  }
}
