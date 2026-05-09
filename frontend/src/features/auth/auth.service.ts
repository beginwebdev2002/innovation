import { Injectable, inject, signal } from '@angular/core';
import { UserStore } from '@entities/user/user.store';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrlMaker } from '@shared/utils';
import { AuthResponse, SignInModel, SignUpModel, User } from './models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private signinEndpoint = signal(apiUrlMaker('auth/signin').href);
  private signupEndpoint = signal(apiUrlMaker('auth/signup').href);
  private profileEndpoint = signal(apiUrlMaker('auth/me').href);

  signin(credentials: SignInModel) {
    return this.http.post<AuthResponse>(this.signinEndpoint(), credentials).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  signup(data: SignUpModel) {
    return this.http.post<AuthResponse>(this.signupEndpoint(), data).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  getProfile() {
    return this.http.get<User>(this.profileEndpoint()).pipe(
      tap((user: User) => this.userStore.setUser(user))
    );
  }
}
