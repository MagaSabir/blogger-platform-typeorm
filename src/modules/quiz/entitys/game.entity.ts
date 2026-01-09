import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { GameQuestion } from './game-question.entity';
import { DomainException } from '../../../core/exceptions/domain.exceptions';
import { DomainExceptionCodes } from '../../../core/exceptions/domain-exception-codes';

export enum GameStatus {
  PENDING = 'PendingSecondPlayer',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
}
@Entity('Game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.PENDING })
  public status: GameStatus;

  @OneToMany(() => Player, (player) => player.game)
  players: Player[];

  @OneToMany(() => GameQuestion, (gq) => gq.game)
  public questions: GameQuestion[];

  @CreateDateColumn()
  pairCreatedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startGameDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishGameDate: Date | null;

  start() {
    this.status = GameStatus.ACTIVE;
    this.startGameDate = new Date();
  }

  processAnswer(player: Player, isCorrect: boolean, answersCount: number) {
    if (isCorrect) {
      player.incrementScore();
    }
    if (answersCount === 5) {
      player.finish();
      this.checkFinishCondition();
    }
  }

  checkFinishCondition() {
    if (!this.players || this.players.length < 2) {
      return;
    }

    const [p1, p2] = this.players;

    if (!p1.finishedAt || !p2.finishedAt) {
      return;
    }

    // Определяем, кто закончил быстрее
    const faster =
      p1.finishedAt < p2.finishedAt
        ? p1
        : p2.finishedAt < p1.finishedAt
          ? p2
          : null;

    if (faster && faster.score > 0) {
      faster.incrementScore();
    }

    this.status = GameStatus.FINISHED;
    this.finishGameDate = new Date();
  }

  static create() {
    const game = new Game();
    game.status = GameStatus.PENDING;
    game.players = [];
    game.questions = [];
    return game;
  }
}
