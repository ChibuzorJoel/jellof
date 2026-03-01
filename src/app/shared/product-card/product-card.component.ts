import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  /* ================= INPUTS ================= */
  @Input() product!: Product;
  @Input() isLoading = false;

  /* ================= OUTPUTS ================= */
  @Output() quickView = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  /* ================= UI STATE ================= */
  selectedSize: string = '';
  selectedColor: string = '';
  showSizeSelector = false;
  addedToCart = false;

  /* ================= CONFIG ================= */
  // WhatsApp Business Number (NO +, NO spaces)
  private whatsappNumber = '2349062307424';

  constructor(private cartService: CartService) {}

  /* ================= QUICK VIEW ================= */

  onQuickView(event?: Event): void {
    event?.stopPropagation();
    this.quickView.emit(this.product);
  }

  /* ================= CART ================= */

  addToCart(event?: Event): void {
    event?.stopPropagation();

    if (!this.product.inStock) return;

    // Require size selection if available
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

    this.afterAddFeedback();
  }

  private afterAddFeedback(): void {
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

  /* ================= WISHLIST ================= */

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.addToWishlist.emit(this.product);
  }

  /* ================= WHATSAPP ================= */

  orderViaWhatsApp(event?: Event): void {
    event?.stopPropagation();

    if (!this.product.inStock) return;

    const message = this.createWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
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

  /* ================= HELPERS ================= */

  isInCart(): boolean {
    const id = this.product._id ?? this.product.id;
    return !!id && this.cartService.isInCart(id);
  }

  getCartQuantity(): number {
    const id = this.product._id ?? this.product.id;
    return id ? this.cartService.getProductQuantity(id) : 0;
  }

  getDiscountPercent(): number {
    if (this.product.originalPrice && this.product.price) {
      const discount =
        ((this.product.originalPrice - this.product.price) /
          this.product.originalPrice) *
        100;
      return Math.round(discount);
    }
    return 0;
  }

  getColorCode(colorName: string): string {
    const colorMap: Record<string, string> = {
      Black: '#000000',
      White: '#FFFFFF',
      Red: '#E74C3C',
      Blue: '#3498DB',
      Green: '#2ECC71',
      Yellow: '#F1C40F',
      Pink: '#E91E63',
      Purple: '#9B59B6',
      Orange: '#E67E22',
      Gray: '#95A5A6',
      Brown: '#8D6E63',
      Navy: '#34495E',
      Beige: '#F5F5DC',
      Cream: '#FFFDD0',
      Olive: '#808000',
      Burgundy: '#800020',
      Camel: '#C19A6B',
      Charcoal: '#36454F',
      Emerald: '#50C878',
      Multi:
        'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A)'
    };

    return colorMap[colorName] || colorName.toLowerCase();
  }
}