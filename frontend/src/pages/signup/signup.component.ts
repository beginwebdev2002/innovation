import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { initialSignUpModel, SignUpModel, signupValidationSchema } from '@features/auth/models/auth.model';

@Component({
  standalone: true,
  imports: [RouterLink, FormField],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  readonly signupFormModel = signal<SignUpModel>(initialSignUpModel);
  readonly signupForm = form(this.signupFormModel, signupValidationSchema);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void { 
   }

  onSubmit() {
    if (this.signupForm().invalid()) {
      this.signupForm().touched();
      return;
    }
    this.authService.signup(this.signupForm().value()).subscribe({
      next: () => {
        this.clearForm();
        this.router.navigate(['/'])
      },
      error: (err: any) => alert(err.error.message)
    });
  }

  private clearForm() {
    this.signupForm().reset();
    this.signupFormModel.set(initialSignUpModel);
  }
}
