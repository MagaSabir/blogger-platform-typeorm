import { LikeStatus } from '../../../posts/application/view-dto/post-view-model';
import { PostLikesMapUtil } from '../../../../../core/utils/likes-map.util';

export interface DbCommentModel {
  id: number;
  content: string;
  createdAt: Date;
  userLogin: string;
  userId: number;
}

export class CommentViewModel {
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

  static toViewModelComments(comments: DbCommentModel[], likesMap: any[]) {
    const likes = PostLikesMapUtil.buildLikesMap(likesMap);
    const items = comments.map((p: DbCommentModel) => ({
      id: p.id.toString(),
      content: p.content,
      commentatorInfo: {
        userId: p.userId.toString(),
        userLogin: p.userLogin,
      },
      createdAt: p.createdAt,
      likesInfo: {
        likesCount: likes[p.id]?.likesCount || 0,
        dislikesCount: likes[p.id]?.dislikesCount || 0,
        myStatus: likes[p.id]?.myStatus || LikeStatus.None,
      },
    }));
    return items;
  }
}
