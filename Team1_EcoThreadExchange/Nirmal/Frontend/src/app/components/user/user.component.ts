import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  /*
  users: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data; // Backend returns the list of users
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users.';
        console.error(error);
        this.loading = false;
      },
    });
  }


  toggleSuspend(user: any): void {
    const updatedStatus = !user.isSuspended;

    // Call backend to update user suspension status
    this.authService.updateUserStatus(user._id, { isSuspended: updatedStatus }).subscribe({
      next: (updatedUser) => {
        user.isSuspended = updatedStatus; // Update locally
      },
      error: (error) => {
        console.error('Failed to update suspension status:', error);
        alert('Failed to update suspension status. Please try again later.');
      },
    });
  }*/




    users: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  search = '';
  isAdmin: boolean | undefined;
  isSuspended: boolean | undefined;

  constructor(private userService: AuthService,private authservice: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  logout(){
    this.authservice.logOut();
    this.router.navigate([`/login/`]);

  }

  // Load users based on the current filters and pagination
  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.pageSize, this.search, this.isAdmin, this.isSuspended)
      .subscribe(response => {
        this.users = response.data;
        this.totalCount = response.totalCount;
      });
  }

  // Handle search input changes
  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page on search change
    this.loadUsers();
  }

  // Handle pagination changes
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onAdminFilterChange(event: any) {
    this.isAdmin = event.target.checked;
    if (!this.isAdmin) { // Refresh only if deselected
      this.refreshPage();
    } else {
      this.loadUsers(); // Fetch users when selected
    }
  }

  onSuspendedFilterChange(event: any) {
    this.isSuspended = event.target.checked;
    if (!this.isSuspended) { // Refresh only if deselected
      this.refreshPage();
    } else {
      this.loadUsers(); // Fetch users when selected
    }
  }
  // Function to handle page refresh
  refreshPage() {
    setTimeout(() => {
      location.reload(); // Reload the page
    }, 500); // Optional delay to ensure the state changes before reload
  }

  // Method to toggle suspension
  toggleSuspend(userId: string, index: number): void {
    this.userService.toggleSuspend(userId).subscribe(
      response => {
        // Toggle the isSuspended value locally after successful response
        this.users[index].isSuspended = !this.users[index].isSuspended;
        
      },
      error => {
        console.error(error);
      }
    );
  }
}
