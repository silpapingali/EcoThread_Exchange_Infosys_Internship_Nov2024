import { Component,OnInit } from '@angular/core';
import { AllTradesService } from '../../services/alltrades.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-my-trades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-trades.component.html',
  styleUrl: './my-trades.component.scss'
})
export class MyTradesComponent implements OnInit {
  recommendedTrades: any[] = []; // Array to hold recommended trades
  isLoading = true; // Loading spinner flag
  errorMessage = ''; // Error message to display

  constructor(private myTradesService: AllTradesService) {}

  ngOnInit(): void {
    this.fetchRecommendedTrades();
  }

  // Fetch recommended trades from the service
  fetchRecommendedTrades(): void {
    this.myTradesService.getRecommendedTrades().subscribe({
      next: (response) => {
        this.recommendedTrades = response.data || []; // Assign response data to the array
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to fetch recommendations';
        this.isLoading = false;
      },
    });
  }
}