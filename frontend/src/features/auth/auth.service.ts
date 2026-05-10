import { Injectable, inject, signal, computed } from '@angular/core';
import { UserStore } from '@entities/user/user.store';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrlMaker } from '@shared/utils';
import { Router } from '@angular/router';
import { AuthResponse, SignInModel, SignUpModel, User } from './models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private router = inject(Router);
  private signinEndpoint = signal(apiUrlMaker('auth/signin').href);
  private signupEndpoint = signal(apiUrlMaker('auth/signup').href);
  private profileEndpoint = signal(apiUrlMaker('auth/me').href);
  private refreshEndpoint = signal(apiUrlMaker('auth/refresh').href);
  private logoutEndpoint = signal(apiUrlMaker('auth/logout').href);

  accessToken = signal<string | null>(sessionStorage.getItem('access_token'));
  isAuthenticated = computed(() => !!this.accessToken());

  setToken(token: string | null) {
    this.accessToken.set(token);
    if (token) {
      sessionStorage.setItem('access_token', token);
    } else {
      sessionStorage.removeItem('access_token');
    }
  }

  signin(credentials: SignInModel) {
    return this.http.post<AuthResponse>(this.signinEndpoint(), credentials, { withCredentials: true })
      .pipe(
        tap((res: AuthResponse) => {
          this.setToken(res.access_token);
          this.userStore.setUser(res.user);
        })
      );
  }

  signup(data: SignUpModel) {
    return this.http.post<AuthResponse>(this.signupEndpoint(), data, { withCredentials: true })
      .pipe(
        tap((res: AuthResponse) => {
          this.setToken(res.access_token);
          this.userStore.setUser(res.user);
        })
      );
  }

  refresh() {
    return this.http.post<AuthResponse>(this.refreshEndpoint(), {}, { withCredentials: true })
      .pipe(
        tap((res: AuthResponse) => {
          this.setToken(res.access_token);
          this.userStore.setUser(res.user);
        })
      );
  }

  logout() {
    return this.http.post<void>(this.logoutEndpoint(), {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.setToken(null);
          this.userStore.setUser(null);
          this.router.navigate(['/signin']);
        })
      );
  }

  getProfile() {
    return this.http.get<User>(this.profileEndpoint(), { withCredentials: true })
    .pipe(
      tap((user: User) => this.userStore.setUser(user))
    );
  }
}
