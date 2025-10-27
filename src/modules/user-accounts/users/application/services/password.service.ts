import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
@Injectable()
export class PasswordService {
  async hash(password: string, saltRound = 10) {
    return bcrypt.hash(password, saltRound);
  }

  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
