import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Session } from '../../sessions/entity/session.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async save(dto: User): Promise<User> {
    return this.userRepo.save(dto);
  }

  async deleteUserById(id: number): Promise<void> {
    await this.sessionRepo.softDelete({ userId: id });
    await this.userRepo.softDelete(id);
  }

  async findUserByLoginOrEmailForAuth(
    loginOrEmail: string,
  ): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findUserOrThrowNotFound(id: number): Promise<User> {
    const user: User | null = await this.userRepo.findOneBy({ id: id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<User | null> {
    const user: User | null = await this.userRepo.findOne({
      where: [{ login: login }, { email: email }],
    });
    return user;
  }

  async findUserByCode(code: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { confirmationCode: code } });
  }

  async findUnconfirmedUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email, isConfirmed: false } });
  }
}
