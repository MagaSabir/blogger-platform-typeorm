import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './questions.entity';
import { Game } from './game.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('GameQuestion')
export class GameQuestion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Question, (question) => question.gameQuestions)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  public questionId: string;

  @ManyToOne(() => Game, (game) => game.questions)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  public gameId: string;
}
