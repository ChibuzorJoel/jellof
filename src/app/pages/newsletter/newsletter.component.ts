import { Component } from '@angular/core';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  email: string = '';
  name: string = '';
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private newsletterService: NewsletterService) {}

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  subscribe(): void {
    // Reset states
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';

    // Validate email
    if (!this.email.trim()) {
      this.submitError = true;
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.submitError = true;
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isSubmitting = true;

    const subscriptionData = {
      email: this.email.trim(),
      name: this.name.trim() || undefined,
      source: 'website'
    };

    this.newsletterService.subscribe(subscriptionData).subscribe({
      next: (response) => {
        console.log('✅ Newsletter subscription successful:', response);

        this.isSubmitting = false;
        this.submitSuccess = true;
        this.successMessage = response.message || 'Thank you for subscribing!';

        // Clear form
        this.email = '';
        this.name = '';

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error('❌ Newsletter subscription failed:', error);

        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = error.error?.message || 'Failed to subscribe. Please try again.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          this.submitError = false;
        }, 5000);
      }
    });
  }

  clearError(): void {
    this.submitError = false;
    this.errorMessage = '';
  }
}