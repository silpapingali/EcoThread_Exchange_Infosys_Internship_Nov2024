import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for standalone component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trade-items-form',
  standalone: true, // Enable standalone mode
  imports: [ReactiveFormsModule, CommonModule], // Import ReactiveFormsModule here
  templateUrl: './trade-items-form.component.html',
  styleUrls: ['./trade-items-form.component.scss'],
})
export class TradeItemsFormComponent {
  tradeItemForm: FormGroup;
  selectedFiles: File[] = [];
  maxFileSize = 10 * 1024 * 1024; // 10MB per file
  maxTotalSize = 50 * 1024 * 1024; // 50MB total size
  maxFiles = 5;
  errorMessage: string = '';
  formSubmitted: boolean = false; // To track submission
  showPreferencesHint = false;
  showSuccessMessage = false;
  error = false;
  imageError: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.tradeItemForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      size: ['', [Validators.required, Validators.maxLength(200)]],
      condition: ['', [Validators.required, Validators.maxLength(200)]],
      preferences: ['', [Validators.required, Validators.maxLength(200)]],
      image: [''],
      username: ['', [Validators.required, Validators.maxLength(200)]],
      createdOn: [new Date().toISOString(), Validators.required],
    });
  }

  ngOnInit(): void {}

  // Handles file selection
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0) + this.selectedFiles.reduce((acc, file) => acc + file.size, 0);

    // Reset error message
    this.errorMessage = '';
    this.imageError = false;
    if (files.length > this.maxFiles - this.selectedFiles.length) {
      this.errorMessage = `You can upload a maximum of ${this.maxFiles} images.`;
    } else if (totalSize > this.maxTotalSize) {
      this.errorMessage = `Total file size must not exceed ${this.maxTotalSize / (1024 * 1024)}MB.`;
    } else {
      Array.from(files).forEach(file => {
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
          this.errorMessage = 'Only PNG and JPG formats are allowed.';
        } else if (file.size > this.maxFileSize) {
          this.errorMessage = `Each file must not exceed ${this.maxFileSize / (1024 * 1024)}MB.`;
        } else {
          this.selectedFiles.push(file);
        }
      });
    }

    if (this.errorMessage) {
      this.selectedFiles = [];
    }
  }
  onImageBlur() {
    console.log('Blur event triggered');
    if (!this.tradeItemForm.value.images) {
      console.log('Image field is empty');
      this.imageError = true; // Set the error if no files are selected
    } else {
      this.imageError = false;
    }
  }

  onPreferencesInput(): void {
    this.showPreferencesHint = true;
  }

  onPreferencesBlur(): void {
    this.showPreferencesHint = false;
  }

  canSubmit(): boolean {
    return this.tradeItemForm.valid && this.selectedFiles.length > 0;
  }

  onSubmit(): void {
    this.formSubmitted = true; // Mark the form as submitted
    if (this.canSubmit()) {
      const formData = new FormData();
      formData.append('title', this.tradeItemForm.value.title);
      formData.append('size', this.tradeItemForm.value.size);
      formData.append('condition', this.tradeItemForm.value.condition);

      // Split the comma-separated preferences into an array
      const preferencesArray = this.tradeItemForm.value.preferences
        .split(',')
        .map((preference: string) => preference.trim());
      formData.append('preferences', JSON.stringify(preferencesArray)); // Convert to JSON string for backend

      formData.append('username', this.tradeItemForm.value.username);
      formData.append('createdOn', new Date().toISOString());

      // Append selected files
      this.selectedFiles.forEach(file => formData.append('images', file));

      // Send the form data to the backend
      this.http.post('http://localhost:3000/trade-items', formData).subscribe(
        (response) => {
          console.log('Trade item added successfully:', response);
          this.showSuccessMessage = true;

          // Hide the message after 4 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.tradeItemForm.reset(); // Reset the form
          }, 4000);
          const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

          this.selectedFiles = []; // Clear selected files
          Object.keys(this.tradeItemForm.controls).forEach((key) => {
            this.tradeItemForm.get(key)?.setErrors(null); // Clear errors
          });
          this.formSubmitted = false; // Reset submission flag
          this.router.navigate(['/trade-items']);
        },
        (error) => {
          console.error('Error adding trade item:', error);
        }
      );
    } else {
      console.error('Form is invalid or no files selected');
    }
  }
}
