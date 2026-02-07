import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  /* ================= INPUTS & OUTPUTS ================= */
  @Input() product!: Product;
  @Output() quickView = new EventEmitter<Product>();

  /* ================= UI STATE ================= */
  selectedSize: string = '';
  selectedColor: string = '';
  showSizeSelector = false;
  addedToCart = false;

  /* ================= CONFIG ================= */
  // WhatsApp Business Number (NO +, NO spaces)
  private whatsappNumber = '2349062307424';

  constructor(private cartService: CartService) {}

  /* ================= CART LOGIC ================= */

  addToCart(): void {
    // Require size if sizes exist
    if (this.product.sizes?.length && !this.selectedSize) {
      this.showSizeSelector = true;
      return;
    }

    this.cartService.addToCart(
      this.product,
      1,
      this.selectedSize,
      this.selectedColor
    );

    this.feedbackAfterAdd();
  }

  private feedbackAfterAdd(): void {
    this.addedToCart = true;

    setTimeout(() => {
      this.addedToCart = false;
      this.showSizeSelector = false;
    }, 2000);
  }

  /* ================= SELECTION ================= */

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  /* ================= QUICK VIEW ================= */

  openQuickView(): void {
    this.quickView.emit(this.product);
  }

  /* ================= WHATSAPP ================= */

  orderViaWhatsApp(): void {
    const message = this.createWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  private createWhatsAppMessage(): string {
    return `Hello JELLOF! 👋

I'm interested in this product:

🛍 Product: ${this.product.name}
💰 Price: $${this.product.price.toFixed(2)}
📂 Category: ${this.product.category}
${this.selectedSize ? `📏 Size: ${this.selectedSize}` : ''}
${this.selectedColor ? `🎨 Color: ${this.selectedColor}` : ''}

Please let me know:
- Availability
- Delivery time
- Payment options

Thank you!`;
  }

  /* ================= CART HELPERS ================= */

  isInCart(): boolean {
    const id = this.product._id ?? this.product.id;
    return id ? this.cartService.isInCart(id) : false;
  }
  
  getCartQuantity(): number {
    const id = this.product._id ?? this.product.id;
    return id ? this.cartService.getProductQuantity(id) : 0;
  }
}
