import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoplayInterval: any;
  newsletterEmail = '';

  // Hero Slides Data
  heroSlides = [
    {
      id: 1,
      title: 'New Collection',
      subtitle: 'Spring/Summer 2026',
      description: 'Discover the latest trends in sustainable fashion',
      buttonText: 'Shop Now',
      buttonLink: '/collections',
      image: '../../../assets/images/hero-1.jpg',
      imageAlt: 'Spring Summer Collection'
    },
    {
      id: 2,
      title: 'Timeless Elegance',
      subtitle: 'Classic Pieces',
      description: 'Elevate your wardrobe with our signature styles',
      buttonText: 'Explore',
      buttonLink: '/lookbook',
      image: 'assets/images/hero-2.jpg',
      imageAlt: 'Classic Fashion Collection'
    },
    {
      id: 3,
      title: 'Limited Edition',
      subtitle: 'Exclusive Designs',
      description: 'Be unique with our one-of-a-kind pieces',
      buttonText: 'View Collection',
      buttonLink: '/collections',
      image: 'assets/images/hero-3.jpg',
      imageAlt: 'Limited Edition Collection'
    }
  ];

  // Featured Collections
  featuredCollections = [
    {
      title: 'Summer Essentials',
      description: 'Light and breezy pieces perfect for warm days',
      image: 'assets/images/collection-summer.jpg',
      link: '/collections/summer'
    },
    {
      title: 'Formal Wear',
      description: 'Sophisticated elegance for special occasions',
      image: 'assets/images/collection-formal.jpg',
      link: '/collections/formal'
    },
    {
      title: 'Casual Chic',
      description: 'Effortless style for everyday comfort',
      image: 'assets/images/collection-casual.jpg',
      link: '/collections/casual'
    },
    {
      title: 'Accessories',
      description: 'Complete your look with our curated selection',
      image: 'assets/images/collection-accessories.jpg',
      link: '/collections/accessories'
    }
  ];

  // Why Choose Us Features
  features = [
    {
      icon: '🌿',
      title: 'Sustainable Fashion',
      description: 'Ethically sourced materials and eco-friendly production processes'
    },
    {
      icon: '✨',
      title: 'Premium Quality',
      description: 'Handcrafted with attention to detail and finest materials'
    },
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Complimentary shipping on orders over $100 worldwide'
    },
    {
      icon: '🔄',
      title: 'Easy Returns',
      description: '30-day hassle-free returns and exchanges policy'
    },
    {
      icon: '💎',
      title: 'Exclusive Designs',
      description: 'Unique pieces you won\'t find anywhere else'
    },
    {
      icon: '🎁',
      title: 'Gift Wrapping',
      description: 'Complimentary luxury gift wrapping on all orders'
    }
  ];

  // New Arrivals
  newArrivals = [
    {
      name: 'Silk Summer Dress',
      category: 'Dresses',
      price: 189.99,
      image: 'assets/images/product-1.jpg',
      isNew: true
    },
    {
      name: 'Linen Blazer',
      category: 'Outerwear',
      price: 249.99,
      image: 'assets/images/product-2.jpg',
      isNew: true
    },
    {
      name: 'Cotton Palazzo Pants',
      category: 'Bottoms',
      price: 129.99,
      image: 'assets/images/product-3.jpg',
      isNew: true
    },
    {
      name: 'Statement Necklace',
      category: 'Accessories',
      price: 79.99,
      image: 'assets/images/product-4.jpg',
      isNew: true
    },
    {
      name: 'Leather Tote Bag',
      category: 'Bags',
      price: 299.99,
      image: 'assets/images/product-5.jpg',
      isNew: true
    },
    {
      name: 'Silk Scarf',
      category: 'Accessories',
      price: 59.99,
      image: 'assets/images/product-6.jpg',
      isNew: true
    },
    {
      name: 'Tailored Trousers',
      category: 'Bottoms',
      price: 159.99,
      image: 'assets/images/product-7.jpg',
      isNew: true
    },
    {
      name: 'Cashmere Sweater',
      category: 'Tops',
      price: 219.99,
      image: 'assets/images/product-8.jpg',
      isNew: true
    }
  ];

  // About Section Image
  aboutImage = 'assets/images/about-preview.jpg';

  // Instagram Posts
  instagramPosts = [
    { image: 'assets/images/instagram-1.jpg', link: 'https://instagram.com/jellof' },
    { image: 'assets/images/instagram-2.jpg', link: 'https://instagram.com/jellof' },
    { image: 'assets/images/instagram-3.jpg', link: 'https://instagram.com/jellof' },
    { image: 'assets/images/instagram-4.jpg', link: 'https://instagram.com/jellof' },
    { image: 'assets/images/instagram-5.jpg', link: 'https://instagram.com/jellof' },
    { image: 'assets/images/instagram-6.jpg', link: 'https://instagram.com/jellof' }
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // Hero Slider Methods
  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Newsletter Submission
  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      // TODO: Implement newsletter subscription logic
      // You would typically call an API service here
      alert('Thank you for subscribing!');
      this.newsletterEmail = '';
    }
  }

}
