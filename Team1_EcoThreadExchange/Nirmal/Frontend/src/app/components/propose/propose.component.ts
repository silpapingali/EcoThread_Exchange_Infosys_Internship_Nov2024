/*import { Component, OnInit } from '@angular/core';
import { AllItemsService } from '../../services/allitems.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propose.component.html',
  styleUrls: ['./propose.component.scss'],
})
export class ProposeComponent implements OnInit {
  selectedItem: any = null; // The item the user wants to trade
  allItems: any[] = []; // List of all available items
  selectedTradeItemId: string = ''; // Selected item for trade from other users
  currentIndex: number = 0; // To handle carousel sliding

  constructor(
    private allItemsService: AllItemsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSelectedItem();
    this.fetchAllItems();
  }

  // Fetch the selected item passed from the previous page
  fetchSelectedItem(): void {
    const state = history.state;
    if (state && state.selectedItem) {
      this.selectedItem = state.selectedItem;
    } else {
      console.error('Selected item not found!');
      alert('No item selected. Redirecting...');
      this.router.navigate(['/myitems']);
    }
  }

  // Fetch all available items for trade
  fetchAllItems(): void {
    const filters = { searchTerm: '', exactMatch: false, date: '' }; // Example filters
    const page = 1; // Current page
    const pageSize = 10; // Number of items per page

    this.allItemsService.getAllItems(filters, page, pageSize).subscribe(
      (response) => {
        if (response && response.data) {
          // Exclude the already selected item from the list
          this.allItems = response.data.filter(
            (item: any) => item._id !== this.selectedItem._id
          );
        } else {
          this.allItems = [];
        }
      },
      (error) => {
        console.error('Error fetching all items', error);
        alert('Error fetching items. Try again later.');
      }
    );
  }

  // Handle sliding left in the carousel
  slideLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  // Handle sliding right in the carousel
  slideRight(): void {
    if (this.currentIndex < this.allItems.length - 1) {
      this.currentIndex += 1;
    }
  }

  // Get the selected trade item details
  getSelectedTradeItem(): any {
    return this.allItems.find((item) => item._id === this.selectedTradeItemId);
  }

  // Function to propose a trade
  proposeTrade(): void {
    if (!this.selectedTradeItemId) {
      alert('Please select an item to trade from the list!');
      return;
    }

    const tradeDetails = {
      userId1: this.authService.getUserIdFromToken(), // Current user
      userId2:this.getSelectedTradeItem().userId, // Owner of the selected item
      item1: this.selectedItem, // Current user's selected item
      item2: this.getSelectedTradeItem(), // Selected trade item
    };
    

    this.allItemsService.proposeTrade(tradeDetails).subscribe(
      (response:any) => {
        console.log(response.data);
        alert('Trade proposed successfully!');
        this.router.navigate(['/mytrades']); // Navigate to trade history or confirmation page
      },
      (error) => {
        console.error('Error proposing trade', error);
        alert('Failed to propose trade. Try again later.');
      }
    );
    console.log(tradeDetails);
  }

  currentItemIndex = 0; // Tracks the currently displayed item in the carousel

  // Navigate to the previous item
  previousItem(): void {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
    }
  }

  // Navigate to the next item
  nextItem(): void {
    if (this.currentItemIndex < this.allItems.length - 1) {
      this.currentItemIndex++;
    }
  }
}
*/

import { Component, OnInit } from '@angular/core';
import { AllItemsService } from '../../services/allitems.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyItemsService } from '../../services/myitems.service';
@Component({
  selector: 'app-propose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propose.component.html',
  styleUrls: ['./propose.component.scss'],
})
export class ProposeComponent implements OnInit {
  selectedItem: any = null; // The item the user wants to trade
  allItems: any[] = []; // List of all available items
  selectedTradeItemId: string = ''; // Selected item for trade from other users
  
  currentIndex: number = 0; // To handle carousel sliding

  constructor(
    private allItemsService: AllItemsService,
    private myItemsService:MyItemsService,
    private authService: AuthService,
    private router: Router,
    private authservice: AuthService,
  ) {}

  ngOnInit(): void {
    this.fetchSelectedItem();
    this.fetchAllItems();
  }

  logout(){
    this.authservice.logOut();
    this.router.navigate([`/login/`]);

  }
  // Fetch the selected item passed from the previous page
  fetchSelectedItem(): void {
    const state = history.state;
    if (state && state.selectedItem) {
      this.selectedItem = state.selectedItem;
    } else {
      console.error('Selected item not found!');
      alert('No item selected. Redirecting...');
      this.router.navigate(['/myitems']);
    }
  }

  // Fetch all available items for trade
  fetchAllItems(): void {
    const filters = { searchTerm: '', exactMatch: false, date: '' }; // Example filters
    const page = 1; // Current page
    const pageSize = 10; // Number of items per page

    this.myItemsService.getMyItems(filters, page, pageSize).subscribe(
      (response) => {
        if (response && response.data) {
          // Exclude the already selected item from the list
          this.allItems = response.data.filter(
            (item: any) => item._id !== this.selectedItem._id
          );
        } else {
          this.allItems = [];
        }
      },
      (error) => {
        console.error('Error fetching all items', error);
        alert('Error fetching items. Try again later.');
      }
    );
  }

  // Handle sliding left in the carousel
  slideLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  // Handle sliding right in the carousel
  slideRight(): void {
    if (this.currentIndex < this.allItems.length - 1) {
      this.currentIndex += 1;
    }
  }

  // Get the selected trade item details
  getSelectedTradeItem(): any {
    return this.allItems.find((item) => item._id === this.selectedTradeItemId);
  }

  

  // Function to propose a trade
  proposeTrade(): void {
    const selectedTradeItem = this.getSelectedTradeItem();

    if (!selectedTradeItem) {
      alert('Please select an item to trade from the list!');
      return;
    }


    const tradeDetails = {
      userId1:this.selectedItem.userId,  // Current user
      userId2: this.authService.getUserIdFromToken(), // Owner of the selected item
      item1: this.selectedItem, // Current user's selected item
      item2: selectedTradeItem, // Selected trade item
    };

    this.allItemsService.proposeTrade(tradeDetails).subscribe(
      (response: any) => {
        console.log(response.data);
        alert('Trade proposed successfully!');
        this.router.navigate(['/mytrades']); // Navigate to trade history or confirmation page
      },
      (error) => {
        console.error('Error proposing trade', error);
        alert('Failed to propose trade. Try again later.');
      }
    );
    console.log(tradeDetails);
  }

  currentItemIndex = 0; // Tracks the currently displayed item in the carousel

  // Navigate to the previous item
  previousItem(): void {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
    }
  }

  // Navigate to the next item
  nextItem(): void {
    if (this.currentItemIndex < this.allItems.length - 1) {
      this.currentItemIndex++;
    }
  }

}
