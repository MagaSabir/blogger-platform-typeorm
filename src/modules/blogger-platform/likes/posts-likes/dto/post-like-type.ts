import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';

export type PostLikeType = {
  postId: string;
  userId: string;
  status: LikeStatus;
  addedAt: Date;
};
