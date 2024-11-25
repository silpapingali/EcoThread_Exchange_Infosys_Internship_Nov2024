

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
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatInputModule,ReactiveFormsModule,MatButtonModule,CommonModule,FormsModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  authService=inject(AuthService);
  formbuilder=inject(FormBuilder);
  routerr=inject(Router);
  resetForm=this.formbuilder.group({
    email:['',[Validators.required]],
    password:['',[Validators.required]],
    confirmpassword:['',[Validators.required]]
  })
  password: string = '';
  email:string='';
  message:string='';
  confirmPassword: string = '';
  constructor(private http:HttpClient,private router:Router) {   
  }
  redirectToLogin(): void {   //redirecting to login page button.
    this.router.navigate(['/login']);
  }

  onSubmit() {
    let values=this.resetForm.value;
    this.authService.resetpassword(values.email!,values.password!).subscribe({
      next:(response)=>{
        if (this.resetForm.valid && this.resetForm.value.email&& this.resetForm.value.password ===this.resetForm.value.confirmpassword) {
          console.log('Form Submitted');
          alert('Password changed successfully!');
          window.location.reload();
        }
        else{
          this.resetForm.reset();
          this.message = 'Please recheck the password';
          
        }

      },
      error:(err)=>{
        alert("something error");
      }
    })
    



    /*
    */
  }




  
}