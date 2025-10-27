import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
type User = {
  id: string;
  name: string;
  email: string;
};

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getUser(): Promise<User[]> {
    const user: User[] = await this.dataSource.query(
      `
    SELECT * FROM "Users"
    `,
    );

    return user.map((u: User) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));
  }
}
