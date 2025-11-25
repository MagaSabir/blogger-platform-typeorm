import {
  LikesDataRow,
  PostLikesMapUtil,
} from '../../../../../core/utils/likes-map.util';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type LikeDataType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type NewestLikeType = {
  addedAt: Date;
  userId: string;
  login: string;
};

export type PostType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };

  static mapToView(
    post: PostType,
    likesData: LikeDataType | undefined,
    newestLikes: NewestLikeType[] | undefined,
  ) {
    const dto = new PostViewModel();
    dto.id = post.id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: likesData?.likesCount || 0,
      dislikesCount: likesData?.dislikesCount || 0,
      myStatus: likesData?.myStatus || LikeStatus.None,
      newestLikes:
        newestLikes?.map((n) => ({
          addedAt: n.addedAt,
          userId: n.userId.toString(),
          login: n.login,
        })) ?? [],
    };
    return dto;
  }

  static toViewModel(
    posts: PostType[],
    likesMap: LikesDataRow[],
    newestMap: any[],
  ) {
    const likesData = PostLikesMapUtil.buildLikesMap(likesMap);
    const newestLikes = PostLikesMapUtil.buildNewestMap(newestMap);
    const items = posts.map(
      (p: PostType): PostViewModel => ({
        id: p.id.toString(),
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId.toString(),
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          likesCount: likesData[p.id]?.likesCount || 0,
          dislikesCount: likesData[p.id]?.dislikesCount || 0,
          myStatus: likesData[p.id]?.myStatus || 'None',
          newestLikes: newestLikes[p.id] || [],
        },
      }),
    );
    return items;
  }
}
