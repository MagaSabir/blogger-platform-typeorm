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
  PENDING = 'Pending',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
}
@Entity('Game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.PENDING })
  public status: GameStatus;

  @OneToMany(() => Player, (player) => player.game, { cascade: true })
  players: Player[];

  @OneToMany(() => GameQuestion, (gq) => gq.game, { cascade: true })
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

  addPlayer(userId: string) {
    if (this.players.length >= 2) {
      throw new DomainException({
        code: DomainExceptionCodes.BadRequest,
        message: 'Already thwo players',
      });
    }

    const position = this.players.length == 0 ? 1 : 2;

    const player = Player.create(userId, position, this.id);
    this.players.push(player);

    if (position === 2) {
      this.start();
    }
    return player;
  }

  getPlayerById(userId: string) {
    const player = this.players.find((p) => p.userId === userId);
    if (!player) {
      throw new DomainException({
        code: DomainExceptionCodes.BadRequest,
        message: 'player not found in game',
      });
    }
    return player;
  }

  static create() {
    const game = new Game();
    game.status = GameStatus.PENDING;
    game.players = [];
    game.questions = [];
    return game;
  }
}
