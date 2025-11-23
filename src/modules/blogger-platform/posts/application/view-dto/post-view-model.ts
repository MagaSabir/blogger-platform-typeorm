import { LikesMapUtil } from '../../../../../core/utils/likes-map.util';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

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
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };

  static mapToView(
    post: PostType | undefined,
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus | undefined,
    newestLikes: [],
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
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus || LikeStatus.None,
      newestLikes: [],
    };
    return dto;
  }

  static mapToViewModels(posts: PostType[]) {
    return posts.map((u) => this.mapToView(u));
  }

  static toViewModel(posts: PostType[], likesMap: any[], newestMap: any[]) {
    const likesData = LikesMapUtil.buildLikesMap(likesMap, 'postId');
    const newestLikes = LikesMapUtil.buildNewestMap(newestMap);
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
