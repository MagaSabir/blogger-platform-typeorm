export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  // static mapToView(blog): BlogViewModel {
  //   const dto = new BlogViewModel();
  //   dto.id = blog.id.toString();
  //   dto.name = blog.name;
  //   dto.description = blog.description;
  //   dto.websiteUrl = blog.websiteUrl;
  //   dto.createdAt = blog.createdAt;
  //   dto.isMembership = false;
  //
  //   return dto;
  // }
}
