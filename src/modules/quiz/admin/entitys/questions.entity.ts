import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestion } from './game-question.entity';

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
}
