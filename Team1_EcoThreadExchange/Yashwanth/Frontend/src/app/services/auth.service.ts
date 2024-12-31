import { Injectable,inject } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { env } from 'process';
import { Observable } from 'rxjs';
import  jwt_decode  from 'jwt-decode';
import { tap } from 'rxjs/operators';

interface Item {
  title: string;
  description: string;
  size: string;
  condition: string;
  preferences: string[];
  image: string;
  createdBy: string;
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }
  http=inject(HttpClient);
  private tokenKey: string = 'auth-token';
  // Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  register(name:string,email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/register',{
      name,email,password,
    });
  }
  // Method to check if the email exists
  checkEmailExistence(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(environment.apiUrl+'/api/check-email', { email });
  }
  resetpassword(email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/reset-password',{
      email,
      password:password
    })
  }
  forgotpassword(email:string){
    return this.http.post(environment.apiUrl+'/auth/forgot-password',{
      email
    });
  }
  activateAccount(token: string) {
    return this.http.get(`${environment.apiUrl}/auth/activate?token=${token}`);
  }
  
  
  login(email: string, password: string) {
    return this.http.post<any>(environment.apiUrl+'/auth/login', { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          // Store token and user info in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }
  
  


  get isLoggedIn(){
    let token=localStorage.getItem(this.tokenKey);
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

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token'); // Get the token from localStorage
  
    if (token) {
      try {
        const decoded: any = jwt_decode(token); // Decode the token
        if (decoded && decoded.id) {
          return decoded.id; // Return the userId from the decoded token
        } else {
          console.error('User ID not found in token', decoded);
          return null;
        }
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    } else {
      console.error('No token found in localStorage');
      return null;
    }
  }
  
// Replace with your API endpoint
/*
getAllUsers(): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return this.http.get<any>(environment.apiUrl+'/auth/allusers', { headers });
}
*/
getUsers(page: number = 1, pageSize: number = 10, search: string = '', isAdmin: boolean | undefined = undefined, isSuspended: boolean | undefined = undefined): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString())
    .set('search', search);
  if (isAdmin !== undefined) {
    params = params.set('isAdmin', isAdmin.toString());
  }

  if (isSuspended !== undefined) {
    params = params.set('isSuspended', isSuspended.toString());
  }

  return this.http.get<any>(environment.apiUrl+'/auth/allusers', { params });
}


updateUserStatus(userId: string, updateData: any): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return this.http.put<any>(`http://localhost:3000/auth/users/${userId}/status`, updateData, { headers });
}

private appiUrl = 'http://localhost:3000/auth'; 

// Toggle suspend/unsuspend user
toggleSuspend(userId: string): Observable<any> {
  return this.http.patch(`${this.appiUrl}/users/${userId}/suspend`, {});
}


}