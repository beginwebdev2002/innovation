import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
        { secret: process.env.JWT_SECRET || 'access-secret', expiresIn: '7d' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
