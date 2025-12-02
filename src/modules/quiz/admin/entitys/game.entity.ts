import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { GameQuestion } from './game-question.entity';

@Entity('Game')
export class Game {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public status;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'player_1_id' })
  player_1: Player;

  @Column()
  public player_1_id: string;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'player_2_id' })
  player_2: Player;

  @Column()
  public player_2_id: string;

  public questions: GameQuestion[];
}
