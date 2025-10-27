import { IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';
import { ApiProperty } from '@nestjs/swagger';

export class InputNewPasswordDto {
  @IsString()
  @Trim()
  @Length(6, 20)
  @ApiProperty({
    example: 'password123',
    description: 'New password',
    type: 'string',
  })
  newPassword: string;
  @IsUUID()
  @ApiProperty({
    example: 'code',
    description: 'recovery code',
    type: 'string',
  })
  recoveryCode: string;
}
