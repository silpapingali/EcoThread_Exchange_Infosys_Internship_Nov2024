
import { Component,OnInit } from '@angular/core';
import { MyItemsService } from '../../services/myitems.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-myitems',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myitems.component.html',
  styleUrl: './myitems.component.scss'
})
export class MyitemsComponent implements OnInit  {
  myItems: any[] = [];  // Array to store items
  loading: boolean = true;  // Loading state
  errorMessage: string = '';  // Error message if the request fails

  constructor(private myItemsService: MyItemsService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the user's items on component initialization
    this.myItemsService.getMyItems().subscribe(
      (response) => {
        this.myItems = response;  // Populate myItems with the response data
        this.loading = false; // Set loading to false after data is received
      },
      (error) => {
        this.loading = false;  // Stop loading indicator
        this.errorMessage = 'Failed to load items. Please try again later.';  // Set error message
        console.error('Error:', error);  // Log error to the console
      }
    );
  }
}