import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGaurd } from './core/auth-guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';



export const routes: Routes = [
    {
        path:"home",
        component:HomeComponent,
        canActivate:[authGaurd]
    },
    {
        path:"register",
        component:RegisterComponent
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path:"login",
        component:LoginComponent
    },
    { path: "forgot-password", 
      component: ForgotPasswordComponent
    },
    {
      path:"reset-password",
      component: ResetPasswordComponent
    }
    
];
