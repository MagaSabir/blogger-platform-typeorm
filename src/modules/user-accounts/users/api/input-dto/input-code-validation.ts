import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputCodeValidation {
  @IsUUID()
  @ApiProperty({
    example: 'test',
    description: 'code',
    type: 'string',
  })
  code: string;
}
