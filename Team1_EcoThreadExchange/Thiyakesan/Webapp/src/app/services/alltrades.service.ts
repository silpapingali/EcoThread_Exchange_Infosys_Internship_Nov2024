import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Trade } from "../components/types/trade";
import { environment } from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AllTradesService {
  private readonly apiUrl = `${environment.apiUrl}/trade`; // Base URL for trade-related endpoints
  private readonly myTradesUrl = `${environment.apiUrl}/mytrades`; // URL for my trades
  private readonly tradeItemsUrl = `${environment.apiUrl}/trade-items`; // URL for trade items

  constructor(private http: HttpClient) {}

  // Fetch all trades with pagination
  getAllTrades(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/alltrade`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching all trades:', error);
        return throwError(() => new Error('Failed to fetch all trades'));
      })
    );
  }

  // Fetch trades by user with pagination
  getTradesByUser(offeredBy: string, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('offeredBy', offeredBy)
      .set('page', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/tradesbyuser`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching trades by user:', error);
        return throwError(() => new Error('Failed to fetch trades by user'));
      })
    );
  }

  // Fetch my trades with authorization
  getMyTrades(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.myTradesUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching my trades:', error);
        return throwError(() => new Error('Failed to fetch my trades'));
      })
    );
  }

  // Create a new trade item
  createTradeItem(formData: FormData): Observable<any> {
    return this.http.post<any>(this.tradeItemsUrl, formData).pipe(
      catchError((error) => {
        console.error('Error creating trade item:', error);
        return throwError(() => new Error('Failed to create trade item'));
      })
    );
  }

  // Fetch all trade items
  getAllTradeItems(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.tradeItemsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all trade items:', error);
        return throwError(() => new Error('Failed to fetch all trade items'));
      })
    );
  }
}
