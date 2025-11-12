import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.repo.findOne({
      where: { id },
      relations: ['sessions'],
    });
    if (user) await this.repo.softRemove(user);
  }

  async findUserByLoginOrEmailForAuth(
    loginOrEmail: string,
  ): Promise<User | null> {
    // const query = `SELECT * FROM "Users" WHERE login = $1 OR email = $2`;
    // const result: UserDbModel[] = await this.dataSource.query(query, [
    //   loginOrEmail,
    //   loginOrEmail,
    // ]);
    // return result.length ? result[0] : null;
    return this.repo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
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
