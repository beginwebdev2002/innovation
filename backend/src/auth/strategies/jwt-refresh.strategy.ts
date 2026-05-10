import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@config/env.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET', { infer: true }),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { sub: number; email: string; role: string },
  ) {
    const refreshToken = req.cookies?.refresh_token;
    return { ...payload, refreshToken };
  }
}
