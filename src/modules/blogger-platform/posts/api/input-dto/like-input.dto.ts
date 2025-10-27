import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../application/view-dto/post-view-model';

export class LikeStatusInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
