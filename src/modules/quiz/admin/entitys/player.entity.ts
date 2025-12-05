import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from './users.entity';
import { Answer } from './answer.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('Players')
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.players)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  public userId: string;

  @Column()
  public score: number;

  @OneToOne(() => Game, (game) => game.firstPlayer)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  public gameId: string;

  @OneToMany(() => Answer, (answers) => answers.player)
  answers: Answer[];
}
