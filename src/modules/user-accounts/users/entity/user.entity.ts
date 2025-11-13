import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Session } from '../../sessions/entity/session.entity';
import { BadRequestException } from '@nestjs/common';

@Entity('Users')
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

  @Column({ type: 'character varying', nullable: true })
  public confirmationCode: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  public confirmationCodeExpiration: Date | null;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  emailConfirm(code: string) {
    if (code !== this.confirmationCode) {
      throw new BadRequestException('confirmation code is incorrect');
    }
    if (
      !this.confirmationCodeExpiration ||
      this.confirmationCodeExpiration < new Date()
    ) {
      throw new BadRequestException('CodeExpiration');
    }

    this.isConfirmed = true;
    this.confirmationCode = null;
    this.confirmationCodeExpiration = null;
  }

  updateConfirmationCode(code: string, expiration: Date) {
    this.confirmationCode = code;
    this.confirmationCodeExpiration = expiration;
  }

  newPassword(passwordHash: string) {
    this.passwordHash = passwordHash;
  }

  static createUser(dto: CreateUserDto) {
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.isConfirmed = dto.isConfirmed;
    return user;
  }

  static registerUser(dto: RegisterUserDto) {
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.confirmationCode = dto.confirmationCode;
    user.confirmationCodeExpiration = dto.confirmationCodeExpiration;
    return user;
  }
}
