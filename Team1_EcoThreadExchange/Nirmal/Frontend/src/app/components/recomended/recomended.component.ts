import { Component ,OnInit} from '@angular/core';
import { AllItemsService } from '../../services/allitems.service';
import { CommonModule } from '@angular/common';
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

  constructor(private recommendationService: AllItemsService) {}

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
}
