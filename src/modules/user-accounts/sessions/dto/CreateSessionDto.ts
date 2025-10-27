export class CreateSessionDto {
  userId: string;
  deviceId: string;
  userAgent: string;
  ip: string;
  lastActiveDate: Date;
  expiresAt: Date;
}
