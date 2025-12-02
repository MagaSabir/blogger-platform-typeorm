import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Player')
export class Player {
  @PrimaryGeneratedColumn()
  public id: string;
}
