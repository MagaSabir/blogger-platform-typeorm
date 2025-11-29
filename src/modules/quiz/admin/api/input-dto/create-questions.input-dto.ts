import { IsArray, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';
import { Transform } from 'class-transformer';

export class CreateQuestionsInputDto {
  @IsString()
  @Trim()
  @Length(10, 500)
  body: string;

  @IsArray()
  // @Transform(({ value }) => value.map((v) => String(v)))
  correctAnswers: string[];
}
