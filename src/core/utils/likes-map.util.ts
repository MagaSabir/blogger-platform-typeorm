import {
  LikeDataType,
  LikeStatus,
  NewestLikeType,
} from '../../modules/blogger-platform/posts/application/view-dto/post-view-model';

export class PostLikesMapUtil {
  static buildLikesMap(likesData: LikesDataRow[]) {
    const likesMap: Record<number, LikeDataType> = {};

    for (const row of likesData) {
      likesMap[row.id] = {
        likesCount: Number(row.likesCount),
        dislikesCount: Number(row.dislikesCount),
        myStatus: row.myStatus,
      };
    }

    return likesMap;
  }

  static buildNewestMap(newestLikes: NewestLike[]) {
    const newestMap: Record<number, NewestLikeType[]> = {};

    for (const like of newestLikes) {
      if (!newestMap[like.postId]) {
        newestMap[like.postId] = [];
      }

      if (newestMap[like.postId].length < 3) {
        newestMap[like.postId].push({
          addedAt: like.addedAt,
          userId: like.userId.toString(),
          login: like.login,
        });
      }
    }

    return newestMap;
  }
}

type NewestLike = {
  postId: number;
  addedAt: Date;
  userId: string;
  login: string;
};

export type LikesDataRow = {
  id: number;
  likesCount: string | number;
  dislikesCount: string | number;
  myStatus: LikeStatus;
};
