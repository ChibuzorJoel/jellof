import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  isNew: boolean;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
}

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
  notificationCount = 5;
  
  // Products
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Form states
  isEditing = false;
  editingProduct: Product | null = null;
  showForm = false;
  
  // New product form
  newProduct: Product = this.getEmptyProduct();
  
  // Filter/Search
  searchQuery = '';
  filterCategory = 'all';
  
  // Categories
  categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
  
  // Sizes
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Form helper properties
  colorInput = '';
  additionalImage1 = '';
  additionalImage2 = '';
  
  // API URL
  private apiUrl = 'http://localhost:3000/api/products';
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // Loading
  isLoading = true;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Add demo data first
    this.addDemoProducts();
    // Then load real products
    this.loadProducts();
  }

  addDemoProducts(): void {
    // Add 2 demo products
    this.products = [
      {
        _id: 'DEMO001',
        name: 'Floral Summer Dress',
        category: 'Dresses',
        price: 89.99,
        description: 'Beautiful floral print summer dress, perfect for warm weather',
        image: 'https://via.placeholder.com/60/2d5016/ffffff?text=Dress',
        images: ['https://via.placeholder.com/300/2d5016/ffffff?text=Dress'],
        isNew: true,
        colors: ['Pink', 'Blue', 'White'],
        sizes: ['S', 'M', 'L'],
        inStock: true,
        stockQuantity: 25
      },
      {
        _id: 'DEMO002',
        name: 'Classic Denim Jeans',
        category: 'Bottoms',
        price: 69.99,
        description: 'High-quality denim jeans with perfect fit',
        image: 'https://via.placeholder.com/60/1f3710/ffffff?text=Jeans',
        images: ['https://via.placeholder.com/300/1f3710/ffffff?text=Jeans'],
        isNew: false,
        colors: ['Blue', 'Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        inStock: true,
        stockQuantity: 8
      }
    ];
    
    this.filteredProducts = [...this.products];
    this.calculatePagination();
    this.isLoading = false;
  }

  // Load all products from API
  loadProducts(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        // Merge API products with demo products (if any)
        const apiProducts = response.products || [];
        // Only add API products if they exist, otherwise keep demo products
        if (apiProducts.length > 0) {
          this.products = apiProducts;
        }
        // If no API products, demo products stay from addDemoProducts()
        this.applyFilters();
        console.log('Products loaded:', this.products.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // On error, keep demo products
        this.showError('Using demo products (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply search and filters
  applyFilters(): void {
    let filtered = [...this.products];

    // Category filter
    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.filterCategory);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  // Show create form (renamed from showCreateForm to match HTML)
  addProduct(): void {
    this.newProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.showForm = true;
    this.colorInput = '';
    this.additionalImage1 = '';
    this.additionalImage2 = '';
  }

  // Show edit form
  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.editingProduct = product;
    this.isEditing = true;
    this.showForm = true;
    
    // Populate additional image fields if they exist
    if (product.images && product.images.length > 0) {
      this.newProduct.image = product.images[0] || '';
      this.additionalImage1 = product.images[1] || '';
      this.additionalImage2 = product.images[2] || '';
    }
  }

  // Create new product
  createProduct(): void {
    this.http.post<any>(this.apiUrl, this.newProduct).subscribe({
      next: (response) => {
        this.showSuccess('Product created successfully!');
        this.loadProducts();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.showError('Failed to create product');
      }
    });
  }

  // Update existing product
  updateProduct(): void {
    if (!this.newProduct._id) return;

    this.http.put<any>(`${this.apiUrl}/${this.newProduct._id}`, this.newProduct).subscribe({
      next: (response) => {
        this.showSuccess('Product updated successfully!');
        this.loadProducts();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.showError('Failed to update product');
      }
    });
  }

  // Delete product
  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    this.http.delete<any>(`${this.apiUrl}/${product._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Product deleted successfully!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.showError('Failed to delete product');
      }
    });
  }

  // Save product (create or update)
  saveProduct(): void {
    // Build images array
    const images: string[] = [];
    if (this.newProduct.image) {
      images.push(this.newProduct.image);
    }
    if (this.additionalImage1) {
      images.push(this.additionalImage1);
    }
    if (this.additionalImage2) {
      images.push(this.additionalImage2);
    }
    
    this.newProduct.images = images;

    if (this.isEditing) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  // Close form
  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingProduct = null;
    this.newProduct = this.getEmptyProduct();
    this.colorInput = '';
    this.additionalImage1 = '';
    this.additionalImage2 = '';
  }

  // Get empty product template
  getEmptyProduct(): Product {
    return {
      name: '',
      category: 'Dresses',
      price: 0,
      description: '',
      image: '',
      images: [],
      isNew: false,
      colors: [],
      sizes: [],
      inStock: true,
      stockQuantity: 0
    };
  }

  // Toggle size selection
  toggleSize(size: string): void {
    const index = this.newProduct.sizes.indexOf(size);
    if (index > -1) {
      this.newProduct.sizes.splice(index, 1);
    } else {
      this.newProduct.sizes.push(size);
    }
  }

  // Check if size is selected
  isSizeSelected(size: string): boolean {
    return this.newProduct.sizes.includes(size);
  }

  // Add color from input field
  addColorFromInput(): void {
    const color = this.colorInput.trim();
    if (color && !this.newProduct.colors.includes(color)) {
      this.newProduct.colors.push(color);
      this.colorInput = ''; // Clear input after adding
    }
  }

  // Add color (keep for backwards compatibility)
  addColor(color: string): void {
    if (color && !this.newProduct.colors.includes(color)) {
      this.newProduct.colors.push(color);
    }
  }

  // Remove color
  removeColor(color: string): void {
    const index = this.newProduct.colors.indexOf(color);
    if (index > -1) {
      this.newProduct.colors.splice(index, 1);
    }
  }

  // Show success message
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  // Show error message
  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // Search products
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Filter by category
  onCategoryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Clear search
  clearSearch(): void {
    this.searchQuery = '';
    this.filterCategory = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  performSearch(): void {
    this.onSearch();
  }

  getInitials(): string {
    return this.adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      this.router.navigate(['/admin/login']);
    }
  }

  // Pagination
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Stock status helpers - pass entire product
  getStockStatus(product: Product): string {
    if (!product.inStock || product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity < 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockClass(product: Product): string {
    if (!product.inStock || product.stockQuantity === 0) return 'out-of-stock';
    if (product.stockQuantity < 10) return 'low-stock';
    return 'in-stock';
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}