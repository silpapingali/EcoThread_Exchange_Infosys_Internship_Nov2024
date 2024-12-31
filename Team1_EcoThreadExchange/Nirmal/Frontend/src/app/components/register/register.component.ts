import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  formbuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);

  isSubmitted = false;
  successMessage = '';
  errorMessage = '';

  registerForm: FormGroup<{
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }> = this.formbuilder.group(
    {
      name: this.formbuilder.control('', [Validators.required]),
      email: this.formbuilder.control('', [Validators.required, Validators.email]),
      password: this.formbuilder.control('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: this.formbuilder.control('', [Validators.required]),
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  register() {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      this.markFormControlsAsTouched();
      return;
    }

    const user = this.registerForm.value;
    this.authService.register(user.name!, user.email!, user.password!).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.successMessage = 'Registration successful! Please check your email for the activation link.';
        this.errorMessage = '';
        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.successMessage = '';
        console.error('Registration error:', error);
        this.errorMessage = error.status === 400 ? (error.error.message || 'User already exists.') : 'Server error.';
      },
    });
  }

  private markFormControlsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key as keyof typeof this.registerForm.controls);
      control?.markAsTouched();
    });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
