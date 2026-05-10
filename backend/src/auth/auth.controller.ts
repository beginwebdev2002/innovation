import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthRequest, SignupDto } from './auth.models';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() body: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { refresh_token, ...result } = await this.authService.signin(user);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return result;
  }

  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...result } = await this.authService.signup(body);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Request() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token');
    return this.authService.logout(req.user.userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = <string>req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException('Access Denied');
    const { refresh_token, ...result } =
      await this.authService.refreshTokens(token);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
