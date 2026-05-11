import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '@features/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const handle401Error = (req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refresh().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.access_token);
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${res.access_token}` },
            withCredentials: true
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: true
          })
        );
      })
    );
  }
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
  } else {
    req = req.clone({
      withCredentials: true
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/signin') && !req.url.includes('/auth/signup')) {
        console.log('interceptor error');

        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};
