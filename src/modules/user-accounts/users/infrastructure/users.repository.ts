import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDbModel } from '../api/view-dto/user-db-model';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async save(dto: User): Promise<User> {
    return this.repo.save(dto);
  }

  async deleteUserById(id: number): Promise<void> {
    await this.repo.softDelete({ id: id });
  }

  async findUserByLoginOrEmailForAuth(
    loginOrEmail: string,
  ): Promise<UserDbModel | null> {
    const query = `SELECT * FROM "Users" WHERE login = $1 OR email = $2`;
    const result: UserDbModel[] = await this.dataSource.query(query, [
      loginOrEmail,
      loginOrEmail,
    ]);
    return result.length ? result[0] : null;
  }

  async findUserOrThrowNotFound(id: number): Promise<User> {
    const user: User | null = await this.repo.findOneBy({ id: id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | null> {
    const user: User | null = await this.repo.findOne({
      where: [{ login: login }, { email: email }],
    });
    return user;
  }

  async findUserByCode(code: string): Promise<User | null> {
    return this.repo.findOne({ where: { confirmationCode: code } });
  }

  async findUnconfirmedUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email, isConfirmed: false } });
  }
}
