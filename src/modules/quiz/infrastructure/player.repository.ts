import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entitys/player.entity';
import { In, Repository } from 'typeorm';
import { GameStatus } from '../entitys/game.entity';

@Injectable()
export class PlayerRepository {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  async save(player: Player) {
    await this.repo.save(player);
  }
}
