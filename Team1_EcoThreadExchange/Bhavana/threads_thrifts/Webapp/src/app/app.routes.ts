import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGaurd } from './core/auth-guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { MyitemsComponent } from './components/myitems/myitems.component';
import { RouterModule } from '@angular/router';
import { TradeItemsFormComponent } from './components/trade-items-form/trade-items-form.component';
import { AlltradesComponent } from './components/alltrades/alltrades.component';
import { MytradesComponent } from './components/mytrades/mytrades.component';
import { AllitemsComponent } from './components/allitems/allitems.component';
import { TradeDetailsComponent } from './components/trade-details/trade-details.component';



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
    },
    {
      path: "trade-items-form",
      component: TradeItemsFormComponent
    },
    { 
      path: 'myitems', 
      component: MyitemsComponent
    },
    {
      path:"alltrades",
      component:AlltradesComponent,
    },
    {
      path:"mytrades",
      component:MytradesComponent,
    },
    {
      path:"allitems",
      component:AllitemsComponent,
    },
    {
      path:'trades/:offeredBy',
      component: TradeDetailsComponent,
    },
    {
      path:'',redirectTo: '/home',
      pathMatch:'full'
    }
    
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule {}
