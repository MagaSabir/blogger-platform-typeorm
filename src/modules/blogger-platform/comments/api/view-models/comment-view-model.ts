import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    login: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: string;
    dislikesCount: string;
    myStatus: LikeStatus;
  };
};
