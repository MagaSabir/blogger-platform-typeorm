import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Statistic')
export class Statistic {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid', unique: true })
  public userId: string;

  @Column({ default: 0 })
  public gamesCount: number;

  @Column({ default: 0 })
  public wins: number;

  @Column({ default: 0 })
  public loses: number;

  @Column({ default: 0 })
  public draws: number;

  @Column({ default: 0 })
  public sumScore: number;

  @Column({ type: 'float', default: 0 })
  public avgScore: number;
}
