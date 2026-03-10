import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;

  image?: string;
  images?: string[];

  description?: string;
  category?: string;
  sku?: string;

  inStock?: boolean;

  sizes?: string[];
  colors?: string[];
}

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent implements OnChanges {

  @Input() product: Product | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  images: string[] = [];
  currentImageIndex: number = 0;

  selectedSize: string = '';
  selectedColor: string = '';

  quantity: number = 1;

  showSuccessMessage: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['product'] && this.product) {
      this.initializeProduct();
    }

  }

  // ================= INITIALIZE PRODUCT =================
  initializeProduct(): void {

    if (!this.product) return;

    // Initialize images safely
    if (this.product.images && this.product.images.length > 0) {
      this.images = this.product.images;
    } else if (this.product.image) {
      this.images = [this.product.image];
    } else {
      this.images = [];
    }

    this.currentImageIndex = 0;

    // Auto select size
    if (this.product.sizes && this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0];
    } else {
      this.selectedSize = '';
    }

    // Auto select color
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0];
    } else {
      this.selectedColor = '';
    }

    // Reset quantity
    this.quantity = 1;
  }

  // ================= IMAGE CONTROLS =================
  previousImage(): void {

    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }

  }

  nextImage(): void {

    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    }

  }

  selectImage(index: number): void {

    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
    }

  }

  // ================= PRODUCT OPTIONS =================
  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  // ================= QUANTITY =================
  increaseQuantity(): void {

    if (this.quantity < 99) {
      this.quantity++;
    }

  }

  decreaseQuantity(): void {

    if (this.quantity > 1) {
      this.quantity--;
    }

  }

  // ================= CART =================
  addToCart(): void {

    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
  }

  // ================= WISHLIST =================
  addToWishlist(): void {

    if (!this.product) return;

    console.log('Added to wishlist:', this.product);

    alert('Product added to wishlist!');
  }

  // ================= MODAL =================
  closeModal(): void {

    this.close.emit();

  }

  // ================= BUY NOW =================
  buyNow(): void {

    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    this.closeModal();

    this.router.navigate(['/checkout']);
  }

}