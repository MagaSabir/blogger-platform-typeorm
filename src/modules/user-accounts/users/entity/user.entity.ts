import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public login: string;

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  public createdAt: Date;

  @Column()
  public isConfirmed: boolean;

  @Column('uuid', { default: () => 'uuid_generate_v4()' })
  public confirmationCode: string;

  @Column()
  public confirmationCodeExpiration: Date;

  @Column()
  public deletedAt: Date;
}
