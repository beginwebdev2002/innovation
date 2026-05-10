import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { sub: number; email: string; role: string },
  ) {
    const refreshToken = req
      .get('Authorization')
      ?.replace('Bearer', '')
      ?.trim();
    return { ...payload, refreshToken };
  }
}
