import {Component,Input,Output,EventEmitter, OnChanges} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent implements OnChanges {

  /* ================= INPUTS / OUTPUTS ================= */
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  /* ================= IMAGE GALLERY ================= */
  currentImageIndex = 0;
  images: string[] = [];

  /* ================= SELECTION ================= */
  selectedSize = '';
  selectedColor = '';
  quantity = 1;

  /* ================= STATE ================= */
  addedToCart = false;

  constructor(private cartService: CartService) {}

  /* ================= LIFECYCLE ================= */

  ngOnChanges(): void {
    if (this.product) {
      this.initializeGallery();
      this.resetSelections();
    }
  }

  /* ================= GALLERY ================= */

  private initializeGallery(): void {
    this.images = [];

    if (this.product?.image) {
      this.images.push(this.product.image);
    }

    if (this.product?.images?.length) {
      this.images.push(...this.product.images);
    }

    this.currentImageIndex = 0;
  }

  previousImage(): void {
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.images.length - 1
        : this.currentImageIndex - 1;
  }

  nextImage(): void {
    this.currentImageIndex =
      this.currentImageIndex === this.images.length - 1
        ? 0
        : this.currentImageIndex + 1;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  /* ================= SELECTION ================= */

  private resetSelections(): void {
    this.selectedSize = this.product?.sizes?.[0] ?? '';
    this.selectedColor = this.product?.colors?.[0] ?? '';
    this.quantity = 1;
    this.addedToCart = false;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  /* ================= QUANTITY ================= */

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /* ================= CART ================= */

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    this.addedToCart = true;
    setTimeout(() => (this.addedToCart = false), 2000);
  }

  isInCart(): boolean {
    const id = this.product?._id ?? this.product?.id;
    return id ? this.cartService.isInCart(id) : false;
  }

  getCartQuantity(): number {
    const id = this.product?._id ?? this.product?.id;
    return id ? this.cartService.getProductQuantity(id) : 0;
  }

  /* ================= WHATSAPP ================= */

  orderViaWhatsApp(): void {
    if (!this.product) return;

    const message = this.createWhatsAppMessage();
    const whatsappNumber = '2349062307424'; // NO +

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  }

  private createWhatsAppMessage(): string {
    return `Hello JELLOF! 👋

I'm interested in this product:

🛍 Product: ${this.product?.name}
💰 Price: $${this.product?.price.toFixed(2)}
📦 Quantity: ${this.quantity}
${this.selectedSize ? `📏 Size: ${this.selectedSize}` : ''}
${this.selectedColor ? `🎨 Color: ${this.selectedColor}` : ''}

Please let me know about availability and delivery.

Thank you!`;
  }

  /* ================= MODAL ================= */

  closeModal(): void {
    this.close.emit();
  }

  onBackgroundClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}
