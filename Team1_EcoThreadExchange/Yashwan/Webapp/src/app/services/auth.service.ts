import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { env } from 'process';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  http=inject(HttpClient);
  register(name:string,email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/register',{
      name,email,password,
    });
  }
  forgotPassword(email:string){
    return this.http.post(environment.apiUrl+'/auth/reset-password',{email})
  }

  login(email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/login',{
      email,password,
    });
  }

 
  resetPassword(email: string, newPassword: string): Observable<any> {
    const payload = { email, newPassword };
    return this.http.post('/api/reset-password', payload);
  }

  get isLoggedIn(){
    let token=localStorage.getItem("token");
    if(token){
      return true;
    }
    return false;
  }

  get isAdmin(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).isAdmin;
    }
    return null;
  }
  get userName(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).name;
    }
    return null;
  }
  
  get userEmail(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).email;
    }
    return null;
  }

  logOut(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }




}