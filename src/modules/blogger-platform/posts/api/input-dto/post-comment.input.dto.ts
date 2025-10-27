import { IsString, Length } from 'class-validator';

export class PostCommentInputDto {
  @IsString()
  @Length(20, 300)
  content: string;
}
