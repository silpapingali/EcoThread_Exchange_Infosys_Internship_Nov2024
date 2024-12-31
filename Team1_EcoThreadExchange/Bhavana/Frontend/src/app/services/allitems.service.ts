
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllItemsService {
  private apiUrl = `${environment.apiUrl}/myitems/allitems`;
  constructor(private http: HttpClient) {}

    getAllItems(filters: any = {}, page: number, pageSize: number): Observable<any> {
      const token = localStorage.getItem('token');
      if (!token) {
        return throwError(() => new Error('User is not authenticated'));
      }
    
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      let params = new HttpParams();
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.exactMatch !== undefined) params = params.set('exactMatch', filters.exactMatch.toString());
      if (filters.date) params = params.set('date', filters.date);
    
      return this.http
        .get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`, { headers, params })
        .pipe(
          catchError((error) => {
            console.error('Error fetching all items:', error);
            return throwError(() => new Error('Failed to fetch all items'));
          })
        );
    }
    
  private baseUrl = 'http://localhost:3000/myitems/recommended'; // Backend base URL


  // Fetch recommended items
  getRecommendedItems(): Observable<any> {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Pass token in headers
    });
    return this.http.get<any>(this.baseUrl, { headers });
  }




  private apiUrl6 = 'http://localhost:3000/trade-items'; 

  postTradeItem(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl6, formData, { headers });
  }
  private proposeUrl = `${environment.apiUrl}/trade/propose`;
  proposeTrade(tradeDetails: any): Observable<any> {
    return this.http.post(`${this.proposeUrl}`, tradeDetails);
  }

  private baseeUrl= `${environment.apiUrl}/myitems`;  // API URL to get all items

  // Method to block an item
  blockItem(itemId: any): Observable<any> {
    return this.http.patch(`${this.baseeUrl}/block/${itemId}`, {});
  }

  unblockItem(itemId: any): Observable<any> {
    return this.http.patch(`${this.baseeUrl}/unblock/${itemId}`, {});
  }
 
}

