import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from '../../user-accounts/users/entity/user.entity';
import { Game } from './game.entity';

@Entity('Player')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.players)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  public userId: string;

  @ManyToOne(() => Game, (game) => game.players)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  public gameId: string;

  @Column({ default: 0 })
  public score: number;

  @Column({ type: 'int' })
  public position: number;

  @OneToMany(() => Answer, (answer) => answer.player)
  answers: Answer[];
}
