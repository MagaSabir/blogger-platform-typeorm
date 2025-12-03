import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { GameQuestion } from './game-question.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

export enum GameStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

@Entity('Games')
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.PENDING })
  public status: GameStatus;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'firstPlayerId' })
  firstPlayer: Player;

  @Column()
  public firstPlayerId: string;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'secondPlayerId' })
  secondPlayer: Player;

  @Column()
  public secondPlayerId: string;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.game)
  public questions: GameQuestion[];
}
