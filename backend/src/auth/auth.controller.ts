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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

interface AuthRequest {
  user: {
    userId: number;
    sub: number;
    email: string;
    role: string;
    refreshToken: string;
  };
}

interface SignupDto {
  email: string;
  password: string;
  [key: string]: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: Record<string, string>) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.signin(user);
  }

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Request() req: AuthRequest) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
