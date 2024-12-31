import { HttpClient,HttpParams,HttpHeaders } from "@angular/common/http";
import { inject,Injectable } from "@angular/core";
import { Trade } from "../types/trade";
import { environment } from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from "rxjs/operators";

@Injectable({
    providedIn:'root'
})

export class AllTradesService{
    http=inject (HttpClient);
    constructor(){}
    
      private apiUrll = 'http://localhost:3000/trade';
    
      
    
      // Fetch trades for the user
  getTrades(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>('http://localhost:3000/trade/trades', { params });
  }

  // Update trade status (accept/reject)
  updateTradeStatus(tradeId: string, status: 'accepted' | 'rejected'): Observable<any> {
    return this.http.put<any>(`${this.apiUrll}/trades/${tradeId}/status`, { status });
  }

 getTradesByUser(offeredBy: string, pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/trade/tradesbyuser`, {
      params: {
        offeredBy: offeredBy,
        page: pageIndex.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  
  
  private apiUrl = `${environment.apiUrl}/mytrades/mytrade`; 
  getMyTrades(filters: any = {},page: number, pageSize: number): Observable<any> {
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
        console.error('Error in fetching all trades:', error);
        return throwError(() => new Error('Failed to fetch trades'));
      })
    );
  }


  private apiUrl1 = `${environment.apiUrl}/trade-items`;
  createTradeItem(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl1, formData);
  }
  getAllTradeItems(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.apiUrl1);
  }





  private apiUrrl = 'http://localhost:3000/trade/allnewtrades'; // Replace with your backend API URL

// Fetch trades for the user
getAllnewTrades(page: number, pageSize: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrrl}`, {
    params: {
      page: page.toString(),
      pageSize: pageSize.toString()
    }
  }).pipe(
    map(response => {
      // Log the full response to ensure `isBlocked` field is there
      console.log('Response from API in Service:', response);
      return response;
    })
  );
}
  
private aapiUrl = 'http://localhost:3000/trade/recommendedtrades'; // API endpoint for fetching recommended trades


// Fetch recommended trades for the current user
getRecommendedTrades(): Observable<any> {
  return this.http.get<any>(this.aapiUrl); // API call to fetch recommended trades
}
}

