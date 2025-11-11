import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { CreateSessionDto } from '../dto/CreateSessionDto';
@Entity('Sessions')
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'uuid' })
  public deviceId: string;

  @Column({ type: 'varchar', length: 30 })
  public ip: string;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  public lastActiveDate: Date;

  @Column({ type: 'timestamp with time zone' })
  public expiresAt: Date;

  @Column({ type: 'varchar', length: 200 })
  public userAgent: string;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  updateSession(iat: Date, exp: Date) {
    this.lastActiveDate = iat;
    this.expiresAt = exp;
  }

  static createSession(dto: CreateSessionDto) {
    const session = new Session();
    session.userId = dto.userId;
    session.deviceId = dto.deviceId;
    session.userAgent = dto.userAgent;
    session.ip = dto.ip;
    session.lastActiveDate = dto.lastActiveDate;
    session.expiresAt = dto.expiresAt;
    return session;
  }
}
