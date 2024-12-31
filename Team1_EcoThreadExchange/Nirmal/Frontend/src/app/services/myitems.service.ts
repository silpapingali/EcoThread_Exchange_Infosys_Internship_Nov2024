

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyItemsService {
    /*
  private apiUrl = 'http://localhost:3000/myitems';  // Your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch my items with token authorization
  getMyItems(): Observable<any> {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    
    if (!token) {
      return throwError(() => new Error('User is not authenticated'));  // If no token, return an error
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Set the token in headers

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error in fetching items:', error);
        return throwError(() => new Error('Failed to fetch items'));  // Handle errors in fetching
      })
    );
  }*/



    private apiUrl = `${environment.apiUrl}/myitems/myitem`; // API URL for fetching items

  constructor(private http: HttpClient) {}
/*
  // Fetch items with optional search filters
  getMyItems(searchQuery: string, dateFilter: string, sizeFilter: string): Observable<any[]> {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      return throwError(() => new Error('User is not authenticated'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params: any = {};

    if (searchQuery) params.search = searchQuery;
    if (dateFilter) params.date = dateFilter;
    if (sizeFilter) params.size = sizeFilter;

    return this.http.get<any[]>(this.apiUrl, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error fetching items:', error);
        return throwError(() => new Error('Failed to fetch items'));
      })
    );
  }*/

  getMyItems(filters: any = {},page: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();
    if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
    if (filters.exactMatch !== undefined) params = params.set('exactMatch', filters.exactMatch.toString());
    if (filters.date) params = params.set('date', filters.date);
    return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error in fetching my items:', error);
        return throwError(() => new Error('Failed to fetch my items'));
      })
    );
  }

}


