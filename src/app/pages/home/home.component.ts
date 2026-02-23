import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // Hero Section - Split Layout (Floxi Style)
  // Left: 6 rotating images with zoom
  leftHeroImages = [
    'assets/images/8.jpeg',
    'assets/images/9.jpeg',
    'assets/images/10.jpeg',
    'assets/images/1.jpeg',
    'assets/images/5.jpeg',
    'assets/images/7.jpeg'
  ];

  // Right Top: 2 featured images
  topRightImages = [
    'assets/images/instagram-1.jpeg',
    'assets/images/instagram-2.jpeg'
  ];

  // Right Bottom: 2 featured images
  bottomRightImages = [
    'assets/images/2.jpeg',
    'assets/images/5.jpeg'
  ];

  currentLeftImageIndex = 0;
  currentTopRightIndex = 0;
  currentBottomRightIndex = 0;

  private heroSubscription?: Subscription;

  // Recent Products - Randomized on page load
  allProducts = [
    {
      id: 1,
      name: 'Elegant Black Dress',
      price: 89.99,
      image: 'assets/images/product-1.jpeg',
      category: 'Dresses',
      inStock: true
    },
    {
      id: 2,
      name: 'Casual Brown Jacket',
      price: 129.99,
      image: 'assets/images/product-2.jpg',
      category: 'Outerwear',
      inStock: true
    },
    {
      id: 3,
      name: 'Designer Denim Jacket',
      price: 149.99,
      image: 'assets/images/product-8.jpeg',
      category: 'Jackets',
      inStock: true
    },
    {
      id: 4,
      name: 'Classic White Tee',
      price: 39.99,
      image: 'assets/images/instagram-6.jpeg',
      category: 'Tops',
      inStock: true
    },
    {
      id: 5,
      name: 'Formal Collection',
      price: 199.99,
      image: 'assets/images/collection-formal.jpeg',
      category: 'Formal',
      inStock: true
    },
    {
      id: 6,
      name: 'Summer Collection',
      price: 159.99,
      image: 'assets/images/ollection-summer.jpeg',
      category: 'Summer',
      inStock: true
    },
    {
      id: 7,
      name: 'Casual Collection',
      price: 94.99,
      image: 'assets/images/collection-casual.jpeg',
      category: 'Casual',
      inStock: true
    },
    {
      id: 8,
      name: 'Instagram Style 3',
      price: 79.99,
      image: 'assets/images/instagram-3.jpeg',
      category: 'Trending',
      inStock: true
    },
    {
      id: 9,
      name: 'Instagram Style 4',
      price: 89.99,
      image: 'assets/images/instagram-4.jpeg',
      category: 'Trending',
      inStock: true
    },
    {
      id: 10,
      name: 'Instagram Style 5',
      price: 69.99,
      image: 'assets/images/instagram-5.jpeg',
      category: 'Trending',
      inStock: true
    }
  ];

  recentProducts: any[] = [];
  featuredProducts: any[] = [];

  ngOnInit(): void {
    this.startHeroRotation();
    this.loadRandomProducts();
  }

  ngOnDestroy(): void {
    if (this.heroSubscription) {
      this.heroSubscription.unsubscribe();
    }
  }

  // Hero Image Rotation
  startHeroRotation(): void {
    // Rotate left section every 3 seconds
    this.heroSubscription = interval(3000).subscribe(() => {
      this.rotateLeftImage();
    });

    // Rotate top right section every 4 seconds
    setInterval(() => {
      this.rotateTopRightImages();
    }, 4000);

    // Rotate bottom right section every 5 seconds
    setInterval(() => {
      this.rotateBottomRightImages();
    }, 5000);
  }

  rotateLeftImage(): void {
    this.currentLeftImageIndex = (this.currentLeftImageIndex + 1) % this.leftHeroImages.length;
  }

  rotateTopRightImages(): void {
    this.currentTopRightIndex = (this.currentTopRightIndex + 1) % this.topRightImages.length;
  }

  rotateBottomRightImages(): void {
    this.currentBottomRightIndex = (this.currentBottomRightIndex + 1) % this.bottomRightImages.length;
  }

  // Random Products (Changes on page load)
  loadRandomProducts(): void {
    // Shuffle products
    const shuffled = this.shuffleArray([...this.allProducts]);
    
    // Pick 2 random products for "Recent" section
    this.recentProducts = shuffled.slice(0, 2);
    
    // Pick 4 different random products for "Featured" section
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

  // Helper Methods
  getCurrentLeftImage(): string {
    return this.leftHeroImages[this.currentLeftImageIndex];
  }

  getCurrentTopRightImage(): string {
    return this.topRightImages[this.currentTopRightIndex];
  }

  getCurrentBottomRightImage(): string {
    return this.bottomRightImages[this.currentBottomRightIndex];
  }

  // Newsletter
  newsletterEmail = '';

  subscribeNewsletter(): void {
    if (!this.newsletterEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newsletterEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    console.log('Newsletter subscription:', this.newsletterEmail);
    alert('Thank you for subscribing!');
    this.newsletterEmail = '';
  }
}