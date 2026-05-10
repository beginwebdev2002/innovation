import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '@users/users.service';
import { EnvironmentVariables } from '@config/env.interface';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password' | 'refreshToken'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { id, email, role, createdAt, updatedAt } = user;
      return { id, email, role, createdAt, updatedAt };
    }
    return null;
  }

  async signin(user: Omit<User, 'password' | 'refreshToken'>) {
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return { ...tokens, user };
  }

  async signup(data: Prisma.UserCreateInput) {
    const user = await this.usersService.create(data);
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    const { id, email, role, createdAt, updatedAt } = user;
    return { ...tokens, user: { id, email, role, createdAt, updatedAt } };
  }

  async logout(userId: number) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(userId: number, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET', { infer: true }),
          expiresIn:
            this.configService.get('JWT_ACCESS_EXPIRED', { infer: true }) ||
            '1d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET', { infer: true }),
          expiresIn:
            this.configService.get('JWT_REFRESH_EXPIRED', { infer: true }) ||
            '7d',
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
