import { Component ,OnInit} from '@angular/core';
import { AllItemsService } from '../../services/allitems.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recomended',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomended.component.html',
  styleUrl: './recomended.component.scss'
})
export class RecomendedComponent implements OnInit {
  recommendedItems: any[] = []; // Array to hold recommended items
  isLoading = true; // Loading spinner flag
  errorMessage = ''; // Error message to display

  
  constructor(private recommendationService: AllItemsService,private router: Router,) {}

  ngOnInit(): void {
    this.fetchRecommendedItems();
  }

  // Fetch recommended items from the service
  fetchRecommendedItems(): void {
    this.recommendationService.getRecommendedItems().subscribe({
      next: (response) => {
        this.recommendedItems = response.data || []; // Assign response to the array
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to fetch recommendations';
        this.isLoading = false;
      },
    });
  }



   // Handle trade button click
   onTradeClick(item: any): void {
    localStorage.setItem('selectedItem', JSON.stringify(item)); // Store selected item
    this.router.navigate(['/propose'], { state: { selectedItem: item } }); // Navigate to trade page
  }

}