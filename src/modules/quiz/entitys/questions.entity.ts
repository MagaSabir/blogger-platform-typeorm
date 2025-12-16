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
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain.exceptions';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception-codes';
import { BadRequestException } from '@nestjs/common';

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

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  publish() {
    if (this.published) {
      throw new BadRequestException('Question already publish');
    }
    this.published = true;
  }

  unpublish() {
    if (!this.published) {
      throw new BadRequestException('Question already unpublish');
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
