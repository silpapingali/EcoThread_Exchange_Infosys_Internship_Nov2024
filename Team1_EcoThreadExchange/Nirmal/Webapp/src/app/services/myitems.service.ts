import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyItemsService {
  private apiUrl = `${environment.apiUrl}/myitems`; // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch my items with token authorization
  getMyItems(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      return throwError(() => new Error('User is not authenticated')); // If no token, return an error
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in headers

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error in fetching items:', error);
        return throwError(() => new Error('Failed to fetch items')); // Handle errors in fetching
      })
    );
  }
}
