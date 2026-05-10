import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<TUser = any>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
