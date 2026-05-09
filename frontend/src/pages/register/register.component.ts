import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@features/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => alert('Ошибка при регистрации')
    });
  }
}
