import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/models/product-model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  
  /* ---------- Product Data ---------- */
  product: Product | null = null;
  productId: string = '';
  
  /* ---------- Images ---------- */
  images: string[] = [];
  currentImageIndex: number = 0;
  
  /* ---------- Product Options ---------- */
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  
  /* ---------- UI State ---------- */
  isLoading: boolean = true;
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  
  /* ---------- Recommended Products (You May Also Like) ---------- */
  recommendedProducts: Product[] = [];
  carouselPosition: number = 0;
  carouselInterval: any;
  itemsToShow: number = 4; // Number of products visible at once
  autoScrollEnabled: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get product ID from route
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProduct();
      }
    });
  }

  ngOnDestroy(): void {
    // Clear carousel interval
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  /* ---------- LOAD PRODUCT ---------- */
  loadProduct(): void {
    console.log('🔄 Loading product:', this.productId);
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        console.log('✅ Product loaded:', response);
        
        if (response.success && response.product) {
          this.product = response.product;
          this.initializeProduct();
          this.loadRecommendedProducts();
        } else {
          this.errorMessage = 'Product not found';
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load product:', error);
        this.errorMessage = 'Failed to load product. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /* ---------- INITIALIZE PRODUCT ---------- */
  initializeProduct(): void {
    if (!this.product) return;

    // Initialize images
    if (this.product.images && this.product.images.length > 0) {
      this.images = this.product.images;
    } else if (this.product.image) {
      this.images = [this.product.image];
    } else {
      this.images = ['assets/images/placeholder.jpg'];
    }
    
    this.currentImageIndex = 0;

    // Auto-select first size
    if (this.product.sizes && this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0];
    }

    // Auto-select first color
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0];
    }

    // Reset quantity
    this.quantity = 1;

    console.log('✅ Product initialized:', this.product.name);
  }

  /* ---------- LOAD RECOMMENDED PRODUCTS ---------- */
  loadRecommendedProducts(): void {
    if (!this.product) return;

    console.log('🔄 Loading recommended products...');

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.products && response.products.length > 0) {
          const allProducts = response.products;
          
          // Filter products from same category, exclude current product
          let related = allProducts.filter(p => 
            p.category === this.product?.category && 
            p._id !== this.product?._id
          );

          // If not enough products, add random ones
          if (related.length < 8) {
            const remaining = allProducts.filter(p => 
              p._id !== this.product?._id &&
              !related.some(r => r._id === p._id)
            );
            const shuffled = remaining.sort(() => 0.5 - Math.random());
            related = [...related, ...shuffled].slice(0, 8);
          }

          this.recommendedProducts = related.slice(0, 8);
          console.log(`✅ Loaded ${this.recommendedProducts.length} recommended products`);
          
          // Start auto-scroll carousel
          this.startCarousel();
        }
      },
      error: (error) => {
        console.error('❌ Failed to load recommended products:', error);
      }
    });
  }

  /* ---------- CAROUSEL CONTROLS ---------- */
  startCarousel(): void {
    if (this.autoScrollEnabled && this.recommendedProducts.length > this.itemsToShow) {
      this.carouselInterval = setInterval(() => {
        this.nextSlide();
      }, 3000); // Auto-scroll every 3 seconds
    }
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide(): void {
    const maxPosition = this.recommendedProducts.length - this.itemsToShow;
    if (this.carouselPosition < maxPosition) {
      this.carouselPosition++;
    } else {
      this.carouselPosition = 0; // Loop back to start
    }
  }

  previousSlide(): void {
    if (this.carouselPosition > 0) {
      this.carouselPosition--;
    } else {
      this.carouselPosition = this.recommendedProducts.length - this.itemsToShow;
    }
  }

  pauseCarousel(): void {
    this.stopCarousel();
  }

  resumeCarousel(): void {
    this.startCarousel();
  }

  /* ---------- IMAGE CONTROLS ---------- */
  selectImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.images.length - 1;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  /* ---------- PRODUCT OPTIONS ---------- */
  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  /* ---------- QUANTITY ---------- */
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

  /* ---------- CART ACTIONS ---------- */
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
    }, 3000);

    console.log('✅ Added to cart:', this.product.name, 'x', this.quantity);
  }

  buyNow(): void {
    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    this.router.navigate(['/checkout']);
  }

  /* ---------- NAVIGATION ---------- */
  viewProduct(product: Product): void {
    const productId = product._id || product.id;
    if (productId) {
      // Stop carousel before navigation
      this.stopCarousel();
      
      // Navigate to new product
      this.router.navigate(['/product', productId]).then(() => {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/collections']);
  }

  /* ---------- HELPERS ---------- */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getStockStatus(): string {
    if (!this.product) return 'Out of Stock';
    
    if (!this.product.inStock || this.product.stockQuantity === 0) {
      return 'Out of Stock';
    }
    if ((this.product?.stockQuantity || 0) < 10) {
      return `Only ${this.product.stockQuantity} left in stock!`;
    }
    return 'In Stock';
  }

  isInStock(): boolean {
    return !!this.product?.inStock && (this.product?.stockQuantity ?? 0) > 0;
  }
}