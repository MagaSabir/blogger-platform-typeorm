import { IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PublishQuestionInputDto {
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  published: boolean;
}
