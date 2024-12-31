

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyItemsService {
    
    private apiUrl = `${environment.apiUrl}/myitems/myitem`; // API URL for fetching items

  constructor(private http: HttpClient) {}
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


