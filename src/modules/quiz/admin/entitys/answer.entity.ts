import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Question } from './questions.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('Answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  л;
  question: Question;

  @Column()
  public questionId: string;

  @Column()
  public status;

  @ManyToOne(() => Player, (player) => player.answers)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column()
  public playerId: string;
}
