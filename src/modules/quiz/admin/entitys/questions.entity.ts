import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestion } from './game-question.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('Question')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 500 })
  public body: string;

  @Column({ type: 'text', array: true, default: [] })
  public correctAnswers: string[];

  @Column({ default: false })
  public published: boolean;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.question)
  public gameQuestions: GameQuestion[];
}
