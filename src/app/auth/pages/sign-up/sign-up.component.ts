import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export class SignUpComponent {

  fb = inject(FormBuilder);

  hasError = signal(false);

  authService = inject(AuthService);

  router = inject(Router);

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if ( this.form.invalid ) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return
    }
    const { email = '' , password = '', fullName = '' } = this.form.value;
    this.authService.signUp(fullName!, email!, password!).subscribe(isSignUpSuccess => {
      if (isSignUpSuccess) {
        this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
