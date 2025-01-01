
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';            // Import MatInputModule
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],  // Include the necessary modules here
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  formbuilder = inject(FormBuilder);
  message: string = '';  // Message to display after form submission
  routerr = inject(Router);
  authService = inject(AuthService);

  forgotPasswordForm = this.formbuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private http: HttpClient, private router: Router) {}

  redirectToLogin(): void {   // Redirecting to login page button.
    this.router.navigate(['/login']);
  }

  // Method to handle form submission
  onSubmit() {
    const emailControl = this.forgotPasswordForm.get('email');

    // Mark the form control as touched to trigger validation messages
    emailControl?.markAsTouched();
    emailControl?.updateValueAndValidity();

    // Check if form is valid
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.checkEmailAndSendLink(email!);
    } else {
      this.message = 'Please enter a valid email address.';
    }
  }

  checkEmailAndSendLink(email: string) {
    this.authService.checkEmailExistence(email)
      .subscribe({
        next: (response) => {
          if (response.exists) {
            if (response.isSuspended) {
              this.message = 'You are suspended. Please contact support.';
            } else {
              this.sendResetLink(email);
            }
          } else {
            this.message = 'User not found, please register.';
          }
        },
        error: (err) => {
          this.message = 'There was an error checking the email. Please try again later.';
        },
      });
  }
  
  // Method to send reset link to the email
  sendResetLink(email: string) {
    this.authService.forgotpassword(email)
      .subscribe({
        next: (response) => {
          this.message = 'Password reset link has been sent to your email.';
        },
        error: (err) => {
          this.message = 'There was an error sending the reset link. Please try again later.';
        },
      });
  }
}
