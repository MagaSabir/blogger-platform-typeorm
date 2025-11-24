import {
  LikeStatus,
  PostType,
} from '../../../../posts/application/view-dto/post-view-model';
import {
  LikesDataRow,
  PostLikesMapUtil,
} from '../../../../../../core/utils/likes-map.util';

export class BlogPostsViewModel {
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

  static toViewModel(
    posts: PostType[],
    likesMap: LikesDataRow[],
    newestMap: any[],
  ) {
    const likesData = PostLikesMapUtil.buildLikesMap(likesMap);
    const newestLikes = PostLikesMapUtil.buildNewestMap(newestMap);
    console.log(likesData);
    const items = posts.map(
      (p: PostType): BlogPostsViewModel => ({
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
