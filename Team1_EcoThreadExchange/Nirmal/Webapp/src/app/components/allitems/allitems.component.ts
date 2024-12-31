
import { Component ,OnInit} from '@angular/core';
import { AllItemsService } from '../../services/allitems.service';
import { CommonModule } from '@angular/common';
import { Item } from '../../types/item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allitems',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allitems.component.html',
  styleUrl: './allitems.component.scss'
})
export class AllitemsComponent implements OnInit{
  allItems: any[] = [];  // Array to store the fetched items
  loading: boolean = true;  // Loading state for showing loading spinner
  errorMessage: string = '';  // Error message in case of failure

  constructor(private allItemsService: AllItemsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllItems();  // Fetch all items on component initialization
  }

  // Method to fetch all items from the service
  fetchAllItems(): void {
    this.allItemsService.getAllItems().subscribe(
      (response) => {
        this.allItems = response;  // Store the fetched items in the array
        this.loading = false;  // Set loading to false when data is received
      },
      (error) => {
        this.loading = false;  // Stop loading when there is an error
        this.errorMessage = 'Failed to load items. Please try again later.';  // Show error message
        console.error('Error:', error);  // Log error for debugging
      }
    );
  }

  // Optional: Navigate to the item details page (if needed)
  onItemClick(itemId: string): void {
    this.router.navigate(['/items/${itemId}']);  // Navigate to the item details page with itemId
  }
}