import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '@entities/user/user.store';
import { AuthService } from '@features/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  userStore = inject(UserStore);
  private authService = inject(AuthService);

  logout() {
    this.authService.logout()
      .pipe(finalize(() => this.userStore.logout()))
      .subscribe();
  }
}
