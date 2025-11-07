import { IsUUID } from 'class-validator';

export class InputDeviceId {
  @IsUUID()
  deviceId: string;
}
