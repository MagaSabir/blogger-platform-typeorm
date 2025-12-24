import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './questions.entity';
import { Game } from './game.entity';

@Entity('GameQuestion')
export class GameQuestion {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  public questionId: string;

  @ManyToOne(() => Game, (game) => game.questions)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  public gameId: string;

  @Column()
  public order: number;

  static createGameQuestion(game: Game, question: Question, order: number) {
    const gq = new GameQuestion();
    gq.game = game;
    gq.gameId = game.id;
    gq.questionId = question.id;
    gq.question = question;
    gq.order = order;
    return gq;
  }
}
