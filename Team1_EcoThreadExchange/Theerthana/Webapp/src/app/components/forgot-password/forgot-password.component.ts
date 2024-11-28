
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';            // Import MatInputModule
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],  // Include the necessary modules here
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  formbuilder=inject(FormBuilder);
  message: string = '';  // Message to display after form submission
  routerr=inject(Router);
  authService=inject(AuthService);
  forgotPasswordForm=this.formbuilder.group({
    email:['',[Validators.required,Validators.email]],
  })
  constructor(private http:HttpClient,private router:Router) {   
  }
  redirectToLogin(): void {   //redirecting to login page button.
    this.router.navigate(['/login']);
  }

  // Method to handle form submission
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email =this.forgotPasswordForm.value.email
      this.sendResetLink(email!);
    } else {
      this.message = 'Please enter a valid email address.';
    }
  }

// Method to send reset link to the email
sendResetLink(email: string) {
  let value=this.forgotPasswordForm.value;
  this.authService.forgotpassword(value.email!)
    .subscribe({
      next: (response) => {
        this.message='Password reset link has been sent to your email.';
      },
      error: (err) => {
        this.message = 'There was an error. Please try again later.';
      },
      });
  }
}