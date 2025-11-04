import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDbModel } from '../api/view-dto/user-db-model';
import { CreateUserType } from '../../types/create-user-type';
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

  registerUser(dto: CreateUserType) {
    const query = `
            INSERT INTO "Users" ("login", "passwordHash", "email", "confirmationCode")
            VALUES ($1, $2, $3, $4) RETURNING id, login, email, "createdAt"
        `;
    // const result: UserViewModel[] = await this.dataSource.query(query, [
    //   dto.login,
    //   dto.passwordHash,
    //   dto.email,
    //   dto.confirmationCode,
    // ]);
    // const user: UserViewModel = result[0];
    // return { ...user, id: user.id.toString() };
  }

  async findUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | null> {
    // const user: UserViewModel[] = await this.dataSource.query(
    //   `SELECT "login", "passwordHash", "email", "isConfirmed" FROM "Users" WHERE login = $1 OR  email = $2`,
    //   [login, email],
    // );
    const user: User | null = await this.repo.findOne({
      where: [{ login: login }, { email: email }],
    });
    return user;
  }

  async findUserByCode(code: string): Promise<UserDbModel> {
    const user: UserDbModel[] = await this.dataSource.query(
      `SELECT * FROM "Users" WHERE "confirmationCode" = $1 AND "isConfirmed" = false`,
      [code],
    );

    return user[0] ?? null;
  }

  async confirmUserEmail(userId: string): Promise<void> {
    await this.dataSource.query(
      `UPDATE "Users" SET "isConfirmed" = true, "confirmationCodeExpiration" = NULL WHERE id = $1`,
      [userId],
    );
  }

  async findIsNotConfirmedUsersByEmail(
    email: string,
  ): Promise<UserDbModel | null> {
    const user: UserDbModel[] = await this.dataSource.query(
      `SELECT * FROM "Users" WHERE email = $1 AND "isConfirmed" = false`,
      [email],
    );
    return user[0] ?? null;
  }

  async updateConfirmationCode(code: string, email: string) {
    await this.dataSource.query(
      `UPDATE "Users"
       SET
           "confirmationCode" = $1,
           "confirmationCodeExpiration" = NOW() + INTERVAL '24 hours' // генерировать в сервисе и передать сюда.
       WHERE email = $2`,
      [code, email],
    );
  }

  async updatePassword(
    code: string,
    passwordHash: string,
  ): Promise<UserDbModel> {
    const result: UserDbModel[] = await this.dataSource.query(
      `UPDATE "Users" SET "passwordHash" = $1 WHERE "confirmationCode" = $2`,
      [passwordHash, code],
    );
    return result[0] ?? null;
  }
}
