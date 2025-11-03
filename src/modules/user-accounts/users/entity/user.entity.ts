import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity('User')
@Unique(['login', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ collation: 'C' })
  public login: string;

  @Column({ collation: 'C' })
  public email: string;

  @Column()
  public passwordHash: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ default: false })
  public isConfirmed: boolean;

  @Column({ type: 'uuid', nullable: true })
  public confirmationCode: string | null;

  @Column({ nullable: true })
  public confirmationCodeExpiration: Date | null;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  static createUser(dto: CreateUserDto) {
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.password;
    return user;
  }
}
