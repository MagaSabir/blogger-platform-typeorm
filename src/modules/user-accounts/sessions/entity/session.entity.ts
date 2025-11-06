import {
  BaseEntity,
  Column,
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
  id: number;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'varchar', length: 30 })
  ip: string;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  lastActiveDate: Date;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ type: 'varchar', length: 100 })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

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
