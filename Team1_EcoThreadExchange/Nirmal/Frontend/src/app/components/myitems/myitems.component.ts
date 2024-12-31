
import { Component,OnInit,input } from '@angular/core';
import { MyItemsService } from '../../services/myitems.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-myitems',
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe],
  templateUrl: './myitems.component.html',
  styleUrl: './myitems.component.scss'
})
export class MyitemsComponent implements OnInit  {
  myItems: any[] = [];  // Array to store the fetched items
  loading: boolean = false;  // Loading state for showing loading spinner
  errorMessage: string = '';  // Error message in case of failure
  filters = {  // Store filter values
    searchTerm: '',
    exactMatch: false,
    date: '',
  };
  currentPage = 1;
  pageSize = 4;
  totalPages = 1;
  isAdmin: boolean = false;

  constructor(private myItemsService: MyItemsService, private router: Router,private authservice: AuthService) {}

  ngOnInit(): void {
    this.fetchMyItems();  // Fetch items when component initializes
    this.isAdmin = this.authservice.isAdmin; 

    }
    logout(){
      this.authservice.logOut();
      this.router.navigate([`/login/`]);
  
    }

  // Fetch all items with applied filters
  fetchMyItems(): void {
    this.loading = true;  // Set loading to true
    this.myItemsService.getMyItems(this.filters,this.currentPage, this.pageSize).subscribe(
      (response) => {this.myItems = response.data;
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);  // Store the fetched items in the array
        this.loading = false;  // Set loading to false when data is received
      },
      (error) => {
        this.loading = false;  // Set loading to false on error
        this.errorMessage = 'Failed to load items. Please try again later.';  // Show error message
        console.error('Error:', error);  // Log error for debugging
      }
    );
  }

  // Method to handle search input changes
  onSearchChange(): void {
    this.fetchMyItems();  // Trigger search when input changes
  }

  // Method to handle exact match checkbox toggle
  onExactMatchToggle(): void {
    this.fetchMyItems();  // Trigger search when checkbox is toggled
  }

  // Method to handle date input changes
  onDateChange(): void {
    this.fetchMyItems();  // Trigger search when date changes
  }

  // Navigate to item details page
  onItemClick(itemId: string): void {
    this.router.navigate([`/items/${itemId}`]);  // Navigate to the item details page
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchMyItems();
  }
}
  
