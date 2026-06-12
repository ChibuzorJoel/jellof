import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { NewsletterService } from '../../services/newsletter.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private productService: ProductService,
    private newsletterService: NewsletterService,
  ) {}

  // ================= HERO SECTION =================
  leftHeroImages: string[] = [];
  topRightImages: string[] = [];
  bottomRightImages: string[] = [];

  currentLeftImageIndex = 0;
  currentTopRightIndex = 0;
  currentBottomRightIndex = 0;

  private heroSubscription?: Subscription;

  // ================= PRODUCTS =================
  allProducts: any[] = [];
  recentProducts: any[] = [];
  featuredProducts: any[] = [];

  // ================= QUICK VIEW =================
  showQuickView = false;
  selectedProduct: any = null;

  // ================= NEWSLETTER =================
  newsletterEmail = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.startHeroRotation();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.heroSubscription) {
      this.heroSubscription.unsubscribe();
    }
  }

  // ================= LOAD PRODUCTS =================
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        const products = response.products || [];

        this.allProducts = products.map((p: any) => ({
          ...p,
          image: this.fixImagePath(p.image),
          images: p.images?.map((img: string) => this.fixImagePath(img)),
        }));

        this.loadRandomProducts();
        this.setHeroProductImages();
      },
      error: (err) => {
        console.error('Error loading products', err);
      },
    });
  }

  // ================= FIX IMAGE PATH =================
  fixImagePath(image: string): string {
    if (!image) return 'assets/images/1.jpeg';
    if (image.startsWith('http')) return image;
    if (image.startsWith('assets')) return image;
    if (image.startsWith('/uploads'))
      return `${environment.apiUrl.replace('/api', '')}${image}`;
    return `assets/images/${image}`;
  }

  // ================= HERO PRODUCT IMAGES =================
  setHeroProductImages(): void {
    if (!this.allProducts.length) {
      this.leftHeroImages = [
        'assets/images/8.jpeg',
        'assets/images/9.jpeg',
        'assets/images/10.jpeg',
      ];
      this.topRightImages = [
        'assets/images/instagram-1.jpeg',
        'assets/images/instagram-2.jpeg',
      ];
      this.bottomRightImages = ['assets/images/2.jpeg', 'assets/images/5.jpeg'];
      return;
    }

    const shuffled = this.shuffleArray([...this.allProducts]);
    this.leftHeroImages = shuffled
      .slice(0, 3)
      .map((p) => p.image || 'assets/images/8.jpeg');
    this.topRightImages = shuffled
      .slice(3, 5)
      .map((p) => p.image || 'assets/images/instagram-1.jpeg');
    this.bottomRightImages = shuffled
      .slice(5, 7)
      .map((p) => p.image || 'assets/images/2.jpeg');
  }

  // ================= HERO ROTATION =================
  startHeroRotation(): void {
    this.heroSubscription = interval(3000).subscribe(() =>
      this.rotateLeftImage(),
    );
    setInterval(() => this.rotateTopRightImages(), 4000);
    setInterval(() => this.rotateBottomRightImages(), 5000);
  }

  rotateLeftImage(): void {
    this.currentLeftImageIndex =
      (this.currentLeftImageIndex + 1) % this.leftHeroImages.length;
  }

  rotateTopRightImages(): void {
    this.currentTopRightIndex =
      (this.currentTopRightIndex + 1) % this.topRightImages.length;
  }

  rotateBottomRightImages(): void {
    this.currentBottomRightIndex =
      (this.currentBottomRightIndex + 1) % this.bottomRightImages.length;
  }

  // ================= RANDOM PRODUCTS =================
  loadRandomProducts(): void {
    const shuffled = this.shuffleArray([...this.allProducts]);
    this.recentProducts = shuffled.slice(0, 2);
    this.featuredProducts = shuffled.slice(2, 6);
  }

  shuffleArray(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // ================= QUICK VIEW =================
  openQuickView(product: any): void {
    this.selectedProduct = product;
    this.showQuickView = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.selectedProduct = null;
    document.body.style.overflow = 'auto';
  }

  // ================= IMAGE HELPERS =================
  getCurrentLeftImage(): string {
    return this.leftHeroImages[this.currentLeftImageIndex];
  }

  getCurrentTopRightImage(): string {
    return this.topRightImages[this.currentTopRightIndex];
  }

  getSecondTopRightImage(): string {
    const nextIndex =
      (this.currentTopRightIndex + 1) % this.topRightImages.length;
    return this.topRightImages[nextIndex];
  }

  getCurrentBottomRightImage(): string {
    const nextIndex = this.currentBottomRightIndex;
    return this.bottomRightImages[nextIndex];
  }

  getSecondBottomRightImage(): string {
    const nextIndex =
      (this.currentBottomRightIndex + 1) % this.bottomRightImages.length;
    return this.bottomRightImages[nextIndex];
  }

  // ================= NEWSLETTER =================
  subscribeNewsletter(): void {
    this.submitSuccess = false;
    this.submitError = false;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.newsletterEmail.trim()) {
      this.submitError = true;
      this.errorMessage = 'Please enter your email address';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newsletterEmail)) {
      this.submitError = true;
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isSubmitting = true;

    const data = { email: this.newsletterEmail.trim(), source: 'website' };

    this.newsletterService.subscribe(data).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.successMessage = res.message || 'Thank you for subscribing!';
        this.newsletterEmail = '';

        setTimeout(() => (this.submitSuccess = false), 5000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage =
          err.error?.message || 'Failed to subscribe. Please try again.';
        setTimeout(() => (this.submitError = false), 5000);
      },
    });
  }

  clearError(): void {
    this.submitError = false;
    this.errorMessage = '';
  }
}
