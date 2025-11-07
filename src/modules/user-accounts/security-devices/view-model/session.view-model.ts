import { Session } from '../../sessions/entity/session.entity';

export class SessionViewModel {
  userId: string;
  deviceId: string;
  title: string;
  ip: string;
  lastActiveDate: Date;
  expiration: number;

  static mapToViewModel(session: Session[]): SessionViewModel[] {
    return session.map((session) => {
      const s = new SessionViewModel();
      s.ip = session.ip;
      s.title = session.userAgent;
      s.lastActiveDate = session.lastActiveDate;
      s.deviceId = session.deviceId;
      return s;
    });
  }
}
