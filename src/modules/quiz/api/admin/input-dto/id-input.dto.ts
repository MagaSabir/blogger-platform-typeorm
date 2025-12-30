import { IsUUID } from 'class-validator';

export class IdInputDto {
  @IsUUID('4')
  id: string;
}
