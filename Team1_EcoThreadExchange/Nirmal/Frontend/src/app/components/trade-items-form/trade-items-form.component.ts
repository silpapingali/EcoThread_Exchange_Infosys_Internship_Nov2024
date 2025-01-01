import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AllItemsService } from '../../services/allitems.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-trade-items-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trade-items-form.component.html',
  styleUrls: ['./trade-items-form.component.scss'],
})
export class TradeItemsFormComponent {
  @ViewChild('tradeForm') tradeForm!: NgForm;  // Adding ViewChild to access the form

  tradeItem = {
    title: '',
    size: '',
    condition: '',
    preferences: '',
    username: '',
  };

  selectedFiles: File[] = [];
  message: string = '';

  constructor(
    private tradeItemService: AllItemsService,
    private authservice: AuthService,
    private router: Router
  ) {}

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (
      !this.tradeItem.title ||
      !this.tradeItem.size ||
      !this.tradeItem.condition ||
      !this.tradeItem.username ||
      this.selectedFiles.length === 0
    ) {
      this.message = 'Please fill in all required fields correctly.';
      return;
    }

    // Parse preferences into an array
    const preferencesArray = this.tradeItem.preferences
      .split(',')
      .map((pref) => pref.trim());

    // Create a FormData object to send with the request
    const formData = new FormData();
    formData.append('title', this.tradeItem.title);
    formData.append('size', this.tradeItem.size);
    formData.append('condition', this.tradeItem.condition);
    formData.append('preferences', JSON.stringify(preferencesArray));
    formData.append('username', this.tradeItem.username);

    // Append each file to the FormData
    this.selectedFiles.forEach((file) => formData.append('images', file));

    // Call the service to post the trade item
    this.tradeItemService.postTradeItem(formData).subscribe({
      next: (response) => {
        this.message = response.message || 'Trade item added successfully!';
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error posting trade item:', error);
        this.message = error.error?.error || 'Failed to add trade item.';
      },
    });
  }

  resetForm(): void {
    this.tradeItem = {
      title: '',
      size: '',
      condition: '',
      preferences: '',
      username: '',
    };
    this.selectedFiles = [];

    // Reset the form validation states
    this.tradeForm.resetForm();

    // Reset the file input field
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
  }

  logout(): void {
    this.authservice.logOut();
    this.router.navigate(['/login']);
  }
}
