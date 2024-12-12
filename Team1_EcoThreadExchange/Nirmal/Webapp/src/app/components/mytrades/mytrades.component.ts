import { Component,OnInit } from '@angular/core';
import { AllTradesService } from '../../services/alltrades.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Trade } from '../types/trade';
import { TradecardComponent } from '../tradecard/tradecard.component';



@Component({
  selector: 'app-mytrades',
  standalone: true,
  imports: [CommonModule,TradecardComponent],
  templateUrl: './mytrades.component.html',
  styleUrl: './mytrades.component.scss'
})


export class MytradesComponent implements OnInit {
  trades: Trade[] = [];  
  loading: boolean = true;  
  error: string | null = null;  
  constructor(private tradeService: AllTradesService) {}
  ngOnInit(): void {
    this.fetchMyTrades();
  }
  fetchMyTrades(): void {
    this.tradeService.getMyTrades().subscribe(
      (data: any) => {
        if (data && data.length) {
          this.trades = data;  
        } else {
          this.error = 'No trades found.';
        }
        this.loading = false; 
      },
      (error: any) => {
        console.error('Error fetching trades:', error);
        this.error = 'An error occurred while fetching trades.';
        this.loading = false; 
      }
    );
  }
}