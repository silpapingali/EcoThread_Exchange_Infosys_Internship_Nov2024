import { Component,inject,ChangeDetectionStrategy, NgModule,ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,Validators, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog,MatDialogActions,MatDialogClose,MatDialogContent,MatDialogTitle}from '@angular/material/dialog';
import { FormControl,FormGroup,FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatInputModule,ReactiveFormsModule,MatButtonModule,CommonModule,FormsModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  formbuilder=inject(FormBuilder);
  routerr=inject(Router);
  resetForm=this.formbuilder.group({
    password:['',[Validators.required]],
    confirmpassword:['',[Validators.required]]
  })
  password: string = '';
  message:string='';
  confirmPassword: string = '';
  constructor(private http:HttpClient,private router:Router,private authService: AuthService,private formBuilder: FormBuilder) {   
  }
  redirectToLogin(): void {   //redirecting to login page button.
    this.router.navigate(['/login']);
  }
  onSubmit() {
    if (this.resetForm.valid && this.resetForm.value.password ===this.resetForm.value.confirmpassword) {
      console.log('Form Submitted');
      alert('Password changed successfully!');
      window.location.reload();
    }
    else{
      this.resetForm.reset();
      this.message = 'Please recheck the password';
      
    }
  }
  email: string = '';
  newPassword: string = '';
 

  onsubmit()  {
    console.log('Submitting reset password request');
    this.authService.resetPassword(this.email, this.newPassword).subscribe(
      (response) => {
        alert('Password reset successful');
      },
      (error) => {
        alert('Error resetting password');
      }
    );
  }
  

}