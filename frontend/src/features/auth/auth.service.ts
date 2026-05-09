import { Injectable, inject } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { UserStore } from '@entities/user/user.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private userStore = inject(UserStore);

  login(credentials: any) {
    return this.api.post('auth/login', credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  register(data: any) {
    return this.api.post('auth/register', data).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  getProfile() {
    return this.api.get('auth/me').pipe(
      tap((user: any) => this.userStore.setUser(user))
    );
  }
}
