import { Component,inject,Inject,Input,OnInit} from '@angular/core';
import { Trade } from '../../types/trade';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AllTradesService } from '../../services/alltrades.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tradecard',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule],
  templateUrl: './tradecard.component.html',
  styleUrl: './tradecard.component.scss'
})
export class TradecardComponent implements OnInit{
  
    @Input() trade!: Trade;
    router = inject(Router);
    offeredByList: string[] = [];
    preferencesList: string[] = [];
  constructor(){}
    ngOnInit(): void {
      if (this.trade && this.trade.offeredBy) {
        // Check if offeredBy is a string
        if (typeof this.trade.offeredBy === 'string') {
          this.offeredByList = this.trade.offeredBy||[]; // Split into array
        } else if (Array.isArray(this.trade.offeredBy)) {
          this.offeredByList = this.trade.offeredBy;  // Use directly if it's already an array
        }
      }
  
      if (this.trade && this.trade.preferences) {
        // Check if preferences is a string
        if (typeof this.trade.preferences === 'string') {
          this.preferencesList = this.trade.preferences||[]; // Split into array
        } else if (Array.isArray(this.trade.preferences)) {
          this.preferencesList = this.trade.preferences; // Use directly if it's already an array
        }
      }
    }
    onLinkClick(offeredBy: string): void {
      // Navigate to the trade details page for the clicked user
      this.router.navigate(['/trades', offeredBy]);
    }

    
}
