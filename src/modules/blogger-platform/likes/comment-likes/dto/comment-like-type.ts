import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';

export type CommentLikeType = {
  commentId: string;
  userId: string;
  status: LikeStatus;
  addedAt: Date;
};
