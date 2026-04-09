import { Component } from '@angular/core';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  newsletterEmail: string = '';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  currentYear: number = new Date().getFullYear(); // <-- Add this

  socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/jellof', icon: 'instagram' },
    { name: 'Facebook', url: 'https://facebook.com/jellof', icon: 'facebook' },
    { name: 'Twitter', url: 'https://twitter.com/jellof', icon: 'twitter' },
    { name: 'Pinterest', url: 'https://pinterest.com/jellof', icon: 'pinterest' }
  ];

  quickLinks = [
    { name: 'Home', route: '/' },
    { name: 'Collections', route: '/collections' },
    { name: 'Lookbook', route: '/lookbook' },
    { name: 'About', route: '/about' },
    { name: 'Contact', route: '/contact' }
  ];

  customerService = [
    { name: 'Shipping & Delivery', route: '/shipping' },
    { name: 'Returns & Exchanges', route: '/returns' },
    { name: 'Size Guide', route: '/size-guide' },
    { name: 'FAQs', route: '/faqs' }
  ];

  constructor(private newsletterService: NewsletterService) {}

  subscribeNewsletter(): void {
    // validate email
    if (!this.newsletterEmail.trim()) {
      this.showMessage('Please enter your email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newsletterEmail)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    // use NewsletterService
    this.newsletterService.subscribe({ email: this.newsletterEmail, source: 'website' })
      .subscribe({
        next: (response: any) => {
          this.showMessage(response.message || 'Subscribed successfully!', 'success');
          this.newsletterEmail = '';
        },
        error: (error) => {
          const msg = error?.error?.message || 'Subscription failed. Try again.';
          this.showMessage(msg, 'error');
        }
      });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 4000);
  }
}