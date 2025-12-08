import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToMany(() => Player, (player) => player.user)
  players: Player[];
}
