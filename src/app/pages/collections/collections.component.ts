import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/models/product-model';

/* =======================
   Interfaces (Models)
======================= */
export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

/* =======================
   Component
======================= */
@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  /* ---------- Products ---------- */
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  quickViewProduct: Product | null = null;

  /* ---------- Categories ---------- */
  categories: Category[] = [
    { id: 'all', name: 'All Products', image: '', count: 0 }
  ];

  /* ---------- UI State ---------- */
  selectedCategory = 'all';
  sortBy = 'featured';
  priceRange = { min: 0, max: 1000 };
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;
  errorMessage = '';
  showQuickView = false;

  /* ---------- Cart Notification ---------- */
  showCartNotification = false;
  addedProduct: Product | null = null;

  /* ---------- Constructor ---------- */
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /* ---------- Lifecycle ---------- */
  ngOnInit(): void {
    console.log('🔄 Collections component initialized');
    
    // Read query params (search & category)
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery = params['search'];
      if (params['category']) this.selectedCategory = params['category'];
    });

    // Load categories first, then products
    this.loadCategories();
    this.loadProducts();
  }

  /* ---------- LOAD CATEGORIES FROM BACKEND ---------- */
  loadCategories(): void {
    console.log('🔄 Loading categories from backend...');
    
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log('✅ Categories loaded:', response);

        if (response.success && response.categories && response.categories.length > 0) {
          // Map backend categories to UI format
          const backendCategories = response.categories
            .filter(cat => cat.isActive) // Only active categories
            .map(cat => ({
              id: cat.name, // Use name as ID for filtering products
              name: cat.name,
              image: cat.image || `assets/images/category-${cat.name.toLowerCase()}.jpg`,
              count: cat.productCount || 0
            }));

          // Combine with "All Products"
          this.categories = [
            { id: 'all', name: 'All Products', image: '', count: 0 },
            ...backendCategories
          ];

          console.log('✅ Categories ready:', this.categories.map(c => c.name));
        } else {
          console.log('ℹ️ No categories from backend, using defaults');
          this.setDefaultCategories();
        }

        // Update counts after products are loaded
        this.updateCategoryCounts();
      },
      error: (error) => {
        console.error('❌ Failed to load categories:', error);
        console.log('ℹ️ Using default categories');
        this.setDefaultCategories();
      }
    });
  }

  /* ---------- DEFAULT CATEGORIES (FALLBACK) ---------- */
  setDefaultCategories(): void {
    this.categories = [
      { id: 'all', name: 'All Products', image: '', count: 0 },
      { id: 'Dresses', name: 'Dresses', image: 'assets/images/category-dresses.jpg', count: 0 },
      { id: 'Tops', name: 'Tops', image: 'assets/images/category-tops.jpg', count: 0 },
      { id: 'Bottoms', name: 'Bottoms', image: 'assets/images/category-bottoms.jpg', count: 0 },
      { id: 'Outerwear', name: 'Outerwear', image: 'assets/images/category-outerwear.jpg', count: 0 },
      { id: 'Accessories', name: 'Accessories', image: 'assets/images/category-accessories.jpg', count: 0 }
    ];
  }

  /* ---------- LOAD PRODUCTS FROM BACKEND ---------- */
  loadProducts(): void {
    console.log('🔄 Loading products from backend...');
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('✅ Products loaded:', res);

        if (res.products && res.products.length > 0) {
          // Map backend products to frontend format
          this.allProducts = res.products.map(p => ({
            ...p,
            id: p._id?.toString() || p.id?.toString(),
            _id: p._id
          }));

          console.log(`✅ ${this.allProducts.length} products ready`);
        } else {
          console.log('ℹ️ No products from backend');
          this.allProducts = [];
        }
        
        this.updateCategoryCounts();
        this.applyFilters(true);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
        
        // Use empty array instead of hardcoded products
        this.allProducts = [];
        this.updateCategoryCounts();
        this.applyFilters(true);
      }
    });
  }

  retryLoad(): void {
    this.loadProducts();
    this.loadCategories();
  }

  /* ---------- Add to Cart ---------- */
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addedProduct = product;
    this.showCartNotification = true;
  }

  closeCartNotification(): void {
    this.showCartNotification = false;
    this.addedProduct = null;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
    this.closeCartNotification();
  }

  /* ---------- Filters ---------- */
  updateCategoryCounts(): void {
    this.categories.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = this.allProducts.length;
      } else {
        cat.count = this.allProducts.filter(p => p.category === cat.id).length;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    console.log('🔍 Filtering by category:', categoryId);
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters(scrollToProduct: boolean = false): void {
    let filtered = [...this.allProducts];

    // Category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Price
    filtered = filtered.filter(p => p.price >= this.priceRange.min && p.price <= this.priceRange.max);

    // Search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    this.sortProducts(filtered);

    this.displayedProducts = filtered;

    console.log(`✅ Filtered: ${filtered.length} products`);

    if (scrollToProduct) this.scrollToFirstProduct();
  }

  /* ---------- Sorting ---------- */
  sortProducts(products: Product[]): void {
    switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }
  }

  onSortChange(value: string): void {
    this.sortBy = value;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters(true);
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.sortBy = 'featured';
    this.priceRange = { min: 0, max: 1000 };
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  /* ---------- Scroll ---------- */
  private scrollToFirstProduct(): void {
    if (!this.displayedProducts.length) return;

    const product = this.displayedProducts[0];
    const id = product._id || product.id;

    setTimeout(() => {
      const el = document.getElementById(`product-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  /* ---------- Quick View ---------- */
  openQuickView(product: Product): void {
    this.quickViewProduct = product;
    this.showQuickView = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.quickViewProduct = null;
    document.body.style.overflow = 'auto';
  }
}