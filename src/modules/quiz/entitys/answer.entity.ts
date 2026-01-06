import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Question } from './questions.entity';

export enum AnswerStatus {
  CORRECT = 'Correct',
  INCORRECT = 'Incorrect',
}

@Entity('Answers')
@Index(['playerId', 'questionId'], { unique: true })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'enum', enum: AnswerStatus })
  public status: AnswerStatus;

  @ManyToOne(() => Player, (player) => player.answers)
  @JoinColumn({ name: 'playerId' })
  public player: Player;

  @Column()
  public playerId: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  public questionId: string;

  @CreateDateColumn()
  public addedAt: Date;

  static create(playerId: string, questionId: string, isCorrect: boolean) {
    const answer = new Answer();
    answer.playerId = playerId;
    answer.questionId = questionId;
    answer.status = isCorrect ? AnswerStatus.CORRECT : AnswerStatus.INCORRECT;
    return answer;
  }
}
