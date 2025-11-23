export class LikesMapUtil {
  static buildLikesMap<T extends Record<string, any>>(
    likesData: T[],
    entityKey: keyof T,
  ) {
    const likesMap: Record<string | number, any> = {};

    for (const row of likesData) {
      const id = row[entityKey];

      likesMap[id] = {
        likesCount: Number(row.likesCount),
        dislikesCount: Number(row.dislikesCount),
        myStatus: row.myStatus,
      };
    }

    return likesMap;
  }

  static buildNewestMap(newestLikes: NewestLike[]) {
    const newestMap: Record<number, any[]> = {};

    for (const like of newestLikes) {
      if (!newestMap[like.postId]) {
        newestMap[like.postId] = [];
      }

      if (newestMap[like.postId].length < 3) {
        newestMap[like.postId].push({
          addedAt: like.addedAt,
          userId: like.userId.toString(), // корректное приведение
          login: like.login,
        });
      }
    }

    return newestMap;
  }
}

type NewestLike = {
  postId: number;
  addedAt: string;
  userId: string;
  login: string;
};
