import { Blog } from '../../../entity/blog.entity';
import { User } from '../../../../../user-accounts/users/entity/user.entity';

export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  static mapToView(blog: Blog): BlogViewModel {
    const dto = new BlogViewModel();
    console.log(blog);
    dto.id = blog.id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt;
    dto.isMembership = false;

    return dto;
  }

  static mapToViewModels(blogs: Blog[]) {
    return blogs.map((u) => this.mapToView(u));
  }
}
