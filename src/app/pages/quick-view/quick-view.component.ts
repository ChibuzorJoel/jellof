import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent implements OnChanges {
  @Input() product: any = null;
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

  initializeProduct(): void {
    // Initialize images
    this.images = this.product.images || [this.product.image];
    this.currentImageIndex = 0;

    // Auto-select first available size
    if (this.product.sizes && this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0];
    }

    // Auto-select first available color
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0];
    }

    this.quantity = 1;
  }

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
    this.currentImageIndex = index;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

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

  addToWishlist(): void {
    // Implement wishlist functionality
    console.log('Added to wishlist:', this.product);
    alert('Added to wishlist!');
  }

  closeModal(): void {
    this.close.emit();
  }

  buyNow(): void {
    if (!this.product) return;

    // Add to cart
    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    // Close modal
    this.closeModal();

    // Navigate to checkout
    this.router.navigate(['/checkout']);
  }
}