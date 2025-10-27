import { IsUUID } from 'class-validator';

export class InputIdValidation {
  @IsUUID()
  id: string;
}
