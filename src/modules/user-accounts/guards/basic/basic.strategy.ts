import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor() {
    super();
  }

  validate(username: string, password: string) {
    if (username === 'admin' && password === 'qwerty') {
      return { username };
    }
    throw new UnauthorizedException();
  }
}
