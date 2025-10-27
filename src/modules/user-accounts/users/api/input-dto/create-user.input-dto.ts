import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInputDto {
  @IsString()
  @Trim()
  @Length(3, 10)
  @ApiProperty({
    example: 'test',
    description: 'Login пользователя',
    type: 'string',
  })
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  @ApiProperty({ example: '123456', description: 'Пароль пользователя' })
  password: string;

  @Trim()
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;
}
