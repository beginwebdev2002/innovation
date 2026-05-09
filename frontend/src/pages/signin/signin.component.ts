import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@features/auth/auth.service';
import { initialSignInModel, SignInModel, signinValidationSchema } from '@features/auth/models/auth.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, FormField],
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly signinFormModel = signal<SignInModel>(initialSignInModel);
  readonly signinForm = form(this.signinFormModel, signinValidationSchema);

  ngOnInit(): void {
    console.log(this.signinForm());
    
  }

  onSubmit() {
    if (this.signinForm().invalid()) {
      this.signinForm().touched();
      return;
    }
    this.authService.signin(this.signinForm().value()).subscribe({
      next: () => {
        this.clearForm();
        this.router.navigate(['/'])
      },
      error: (err: HttpErrorResponse) => alert(err.error.message)
    });
  }

  private clearForm() {
    this.signinForm().reset();
    this.signinFormModel.set(initialSignInModel);
  }
}
