import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputCodeValidation {
  @IsString()
  @ApiProperty({
    example: 'test',
    description: 'code',
    type: 'string',
  })
  code: string;
}
