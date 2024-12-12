import { Component,inject, ViewChild ,OnInit} from '@angular/core';
import { AllTradesService } from '../../services/alltrades.service';
import { Trade } from '../types/trade';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TradecardComponent } from '../tradecard/tradecard.component';


@Component({
  selector: 'app-alltrades',
  standalone: true,
  imports: [FormsModule,MatPaginatorModule,CommonModule,MatTableModule,MatPaginator,TradecardComponent],
  templateUrl: './alltrades.component.html',
  styleUrl: './alltrades.component.scss'
})


export class AlltradesComponent implements OnInit{
  trades: Trade[] = [];
  totalItems: number = 0;
  pageSize: number = 4;
  page: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  constructor(private allTradesService: AllTradesService) {}
  ngOnInit(): void {
    this.loadTrades();
  }
  loadTrades(): void {
    this.allTradesService
      .getAllTrades(this.page + 1, this.pageSize) 
      .subscribe((result) => {
        this.trades = result.trades;
        this.totalItems = result.totalItems;
      });
  }
  pageChange(event: any): void {
    this.page = event.pageIndex;
    this.loadTrades();
  }
}