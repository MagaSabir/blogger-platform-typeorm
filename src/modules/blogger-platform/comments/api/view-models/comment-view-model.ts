import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';

export interface DbCommentModel {
  id: number;
  content: string;
  createdAt: Date;
  userLogin: string;
  userId: number;
}

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
};

export class CommentMapper {
  static toViewModel(
    comment: DbCommentModel,
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus | undefined,
  ): CommentViewModel {
    return {
      id: comment.id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus: myStatus || LikeStatus.None,
      },
    };
  }
}
