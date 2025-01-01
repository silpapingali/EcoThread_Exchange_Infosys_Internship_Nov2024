import { Component,inject,OnInit } from '@angular/core';
import { AllTradesService } from '../../services/alltrades.service';
import { Trade } from '../../types/trade';
import { ActivatedRoute} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { TradecardComponent } from '../tradecard/tradecard.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-trade-details',
  standalone: true,
  imports: [FormsModule,MatPaginatorModule,TradecardComponent,CommonModule],
  templateUrl: './trade-details.component.html',
  styleUrl: './trade-details.component.scss'
})
export class TradeDetailsComponent  implements OnInit {
  trades: Trade[] = [];  
  offeredBy: string = ''; 
  totalTrades: number = 0;  
  pageIndex: number = 0; 
  pageSize: number = 4; 
  alltradesService = inject(AllTradesService);
  route = inject(ActivatedRoute);
  constructor() {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.offeredBy = params.get('offeredBy') ?? ''; 
      this.loadTradesByUser(this.pageIndex, this.pageSize); 
    });
  }
  loadTradesByUser(pageIndex: number, pageSize: number): void {
    this.alltradesService.getTradesByUser(this.offeredBy, pageIndex, pageSize).subscribe(result => {
      this.trades = result.trades; 
      this.totalTrades = result.total; 
    }, error => {
      console.error('Error fetching trades:', error);  
    });
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTradesByUser(this.pageIndex, this.pageSize);  
  } 
}
 
