import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

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
}
