import { Component, Input } from '@angular/core';


export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  isNew?: boolean;
}
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent {
  @Input() product!: Product;
  
  // WhatsApp Business Number (update with your actual number)
  // Format: country code + number (no + sign, no spaces)
  // Example: 15551234567 for +1 (555) 123-4567
  private whatsappNumber = '+2349062307424';

  constructor() { }

  /**
   * Opens WhatsApp with pre-filled order message
   */
  orderViaWhatsApp(): void {
    // Create the message
    const message = this.createWhatsAppMessage();
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Creates formatted WhatsApp message
   */
  private createWhatsAppMessage(): string {
    return `Hello JELLOF! 👋

I'm interested in ordering:

Product: ${this.product.name}
Price: $${this.product.price.toFixed(2)}
Category: ${this.product.category}

Please let me know about:
- Availability
- Size options
- Delivery time
- Payment methods

Thank you!`;
  }

  /**
   * Quick view functionality (optional)
   */
  quickView(): void {
    // Implement quick view modal if needed
    console.log('Quick view:', this.product);
  }
  

}
