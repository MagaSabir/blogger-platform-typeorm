export type CommentModelType = {
  id: number;
  content: string;
  postId?: string;
  userId: number;
  createdAt: Date;
};
