import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
 // Form Data
 contactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

// Form State
isSubmitting = false;
submitSuccess = false;
submitError = false;
errorMessage = '';

// Contact Information
contactInfo = {
  address: '123 Fashion Avenue, New York, NY 10001',
  email: 'hello@jellof.com',
  phone: '+1 (555) 123-4567',
  hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST'
};

// Social Media Links
socialMedia = [
  { name: 'Instagram', url: 'https://instagram.com/jellof', icon: '📷' },
  { name: 'Facebook', url: 'https://facebook.com/jellof', icon: '👥' },
  { name: 'Twitter', url: 'https://twitter.com/jellof', icon: '🐦' },
  { name: 'Pinterest', url: 'https://pinterest.com/jellof', icon: '📌' }
];

// FAQ Items
faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all unworn items with original tags. Please visit our Returns page for more details.',
    isOpen: false
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 30 countries worldwide. International shipping typically takes 7-14 business days.',
    isOpen: false
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in your account dashboard.',
    isOpen: false
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, complimentary luxury gift wrapping is available on all orders. Select this option at checkout.',
    isOpen: false
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience.',
    isOpen: false
  }
];

constructor(private http: HttpClient) {}

// Toggle FAQ
toggleFaq(index: number): void {
  this.faqs[index].isOpen = !this.faqs[index].isOpen;
}

// Form Validation
validateForm(): boolean {
  if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
    this.errorMessage = 'Please fill in all required fields.';
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.contactForm.email)) {
    this.errorMessage = 'Please enter a valid email address.';
    return false;
  }

  return true;
}

// Submit Form
onSubmit(): void {
  // Reset states
  this.submitSuccess = false;
  this.submitError = false;
  this.errorMessage = '';

  // Validate form
  if (!this.validateForm()) {
    this.submitError = true;
    return;
  }

  this.isSubmitting = true;

  // Send to backend
  this.http.post('http://localhost:3000/api/contact', this.contactForm)
    .subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // Reset form
        this.contactForm = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        };

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = 'Failed to send message. Please try again later.';
      }
    });
}
}
