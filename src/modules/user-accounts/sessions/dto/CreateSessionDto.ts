export class CreateSessionDto {
  userId: number;
  deviceId: string;
  userAgent: string;
  ip: string;
  lastActiveDate: Date;
  expiresAt: Date;
}
