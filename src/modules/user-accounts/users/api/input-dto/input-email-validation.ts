import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputEmailValidation {
  @IsEmail()
  @ApiProperty({
    example: 'exampe@gamil.com',
    description: 'Data for constructing new user',
    type: 'string',
  })
  email: string;
}
