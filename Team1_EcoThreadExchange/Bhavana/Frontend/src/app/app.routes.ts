import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGaurd } from './core/auth-guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AlltradesComponent } from './components/alltrades/alltrades.component';
import { TradeItemsFormComponent } from './components/trade-items-form/trade-items-form.component';
import { TradeDetailsComponent } from './components/trade-details/trade-details.component';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { MyitemsComponent } from './components/myitems/myitems.component';
import { MytradesComponent } from './components/mytrades/mytrades.component';
import { AllitemsComponent } from './components/allitems/allitems.component';
import { UserComponent } from './components/user/user.component';
import { RecomendedComponent } from './components/recomended/recomended.component';
import { ProposeComponent } from './components/propose/propose.component';
import { MyTradesComponent } from './components/my-trades/my-trades.component';
export const routes: Routes = [
    {
        path:"home",
        component:HomeComponent,
        
    },
    {
        path:"register",
        component:RegisterComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"forgot-password",
        component:ForgotPasswordComponent
    },
    {
        path:"reset-password",
        component:ResetPasswordComponent
    },
    {
        path:"alltrades",
        component:AlltradesComponent
    },
    {
        path:"trade-items-form",
        component:TradeItemsFormComponent
    },
    { 
        path: 'trades/:offeredBy',
         component: TradeDetailsComponent 
    },
    { 
        path: '', redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path:'myitems',
        component:MyitemsComponent,
    },
    {
        path:'mytrades',
        component:MytradesComponent,
    },
    {
        path:'allitems',
        component:AllitemsComponent,
    },
    {
        path:'allusers',
        component:UserComponent,
    },
    {
        path:'recomended',
        component:RecomendedComponent,
    },
    {
        path:'propose',
        component:ProposeComponent,
    },
    {
        path:'my-trades',
        component:MyTradesComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }