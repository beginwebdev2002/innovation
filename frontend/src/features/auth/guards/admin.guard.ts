import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { catchError, map, of, retry } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getProfile().pipe(
    map(user => {
      if (user && user.role === 'admin') {
        return true;
      }
      return router.parseUrl('/');
    }),
    retry({ count: 5, delay: 100 }),
    catchError(() => of(router.parseUrl('/')))
  );
};
