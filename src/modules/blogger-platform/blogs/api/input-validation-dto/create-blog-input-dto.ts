import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';

export class CreateBlogInputDto {
  @IsString()
  @Trim()
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @Trim()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
