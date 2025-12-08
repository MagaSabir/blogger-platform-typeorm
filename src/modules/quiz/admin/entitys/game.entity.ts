import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'firstPlayerId' })
  firstPlayer: Player;

  @Column()
  public firstPlayerId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'secondPlayerId' })
  secondPlayer: Player;

  @Column()
  public secondPlayerId: string;

  @OneToMany(() => GameQuestion, (gq) => gq.game)
  public questions: GameQuestion[];

  @CreateDateColumn()
  pairCreatedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startGameDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishGameDate: Date | null;
}
