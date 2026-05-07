import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '@entities/user/user.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  userStore = inject(UserStore);
  
  logout() {
    this.userStore.logout();
  }
}
