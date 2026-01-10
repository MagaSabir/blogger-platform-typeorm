import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Statistic')
export class Statistic {
  @PrimaryColumn('uuid')
  public userId: string;

  @Column({ type: 'int', default: 0 })
  public gamesCount: number;

  @Column({ type: 'int', default: 0 })
  public wins: number;

  @Column({ type: 'int', default: 0 })
  public loses: number;

  @Column({ type: 'int', default: 0 })
  public draws: number;

  @Column({ type: 'int', default: 0 })
  public sumScore: number;

  @Column({ type: 'int', default: 0 })
  public avgScore: number;
}
