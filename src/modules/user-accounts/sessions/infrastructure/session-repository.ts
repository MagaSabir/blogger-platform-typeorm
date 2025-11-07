import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Not, Repository } from 'typeorm';
import { SessionsType } from '../type/sessions-type';
import { NotFoundException } from '@nestjs/common';
import { Session } from '../entity/session.entity';
import { SessionViewModel } from '../../security-devices/view-model/session.view-model';

export class SessionRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Session) private sessionsRepo: Repository<Session>,
  ) {}

  async save(session: Session) {
    await this.sessionsRepo.save(session);
  }

  async findSession(userId: number, deviceId: string): Promise<Session | null> {
    return await this.sessionsRepo.findOne({ where: { userId, deviceId } });
  }

  async deleteSession(userId: number, deviceId: string) {
    await this.sessionsRepo.softDelete({ userId, deviceId });
  }

  async getDeviceSession(userId: number): Promise<SessionViewModel[]> {
    const sessions: Session[] = await this.sessionsRepo.find({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });
    return SessionViewModel.mapToViewModel(sessions);
  }

  async deleteOtherActiveSessions(userId: number, currentDeviceId: string) {
    await this.sessionsRepo.softDelete({
      userId,
      deviceId: Not(currentDeviceId),
    });
  }

  async deleteSessionByDeviceId(deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM "Sessions" WHERE "deviceId" = $1`,
      [deviceId],
    );
  }

  async findSessionOrThrowNotFoundException(
    deviceId: string,
  ): Promise<Session> {
    const session: Session | null = await this.sessionsRepo.findOne({
      where: { deviceId },
    });
    if (!session) throw new NotFoundException();
    return session;
  }
}
