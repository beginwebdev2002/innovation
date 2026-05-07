import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@widgets/header/header.component';
import { AuthService } from '@features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  
  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      this.authService.getProfile().subscribe({
        error: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      });
    }
  }
}
