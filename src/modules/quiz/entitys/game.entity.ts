import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { GameQuestion } from './game-question.entity';

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
}
