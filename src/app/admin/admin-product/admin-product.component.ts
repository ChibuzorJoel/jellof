import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  image: string;
  images?: string[];
  isNew: boolean;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  isOnSale?: boolean;
}

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  // Navigation
  adminName = 'Admin';
  notificationCount = 5;
  searchQuery = '';

  // Products
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  // Categories
  categories: string[] = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes'];
  filterCategory = 'all';

  // Available options
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Form state
  showForm = false;
  isEditing = false;
  newProduct: Product = this.getEmptyProduct();
  
  // Additional form fields
  colorInput = '';
  additionalImage1 = '';
  additionalImage2 = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Messages
  successMessage = '';
  errorMessage = '';
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/products';

  // Quill Editor Configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  quillStyles = {
    height: '250px',
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '6px'
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.addDemoProducts();
    this.loadProducts();
  }

  // Add demo products
  addDemoProducts(): void {
    this.products = [
      {
        _id: 'DEMO001',
        name: 'Floral Summer Dress',
        category: 'Dresses',
        price: 89.99,
        discountPrice: 69.99,
        description: `<h2>Beautiful Floral Summer Dress</h2>
<p>Perfect for warm weather and outdoor events!</p>

<h3>Features:</h3>
<ul>
  <li><strong>Premium Quality</strong> - Made from 100% breathable cotton</li>
  <li><strong>Comfortable Fit</strong> - Relaxed silhouette for all-day wear</li>
  <li><strong>Vibrant Colors</strong> - Beautiful floral print that won't fade</li>
  <li><strong>Easy Care</strong> - Machine washable, wrinkle-resistant</li>
</ul>

<h3>Perfect For:</h3>
<ul>
  <li>Summer parties</li>
  <li>Beach vacations</li>
  <li>Casual outings</li>
  <li>Garden events</li>
</ul>

<p><strong>Size Guide:</strong> Available in S, M, L, XL. Please refer to our size chart for the perfect fit.</p>

<p><em>This dress pairs beautifully with sandals or sneakers for a casual look, or dress it up with heels for evening events!</em></p>`,
        image: 'assets/images/instagram-3.jpeg',
        images: [
          'assets/images/instagram-3.jpeg',
          'assets/images/instagram-2.jpeg',
          'assets/images/instagram-1.jpeg'
        ],
        isNew: true,
        colors: ['Pink', 'Blue', 'Yellow', 'White'],
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
        stockQuantity: 15,
        isOnSale: true
      },
      {
        _id: 'DEMO002',
        name: 'Classic Denim Jeans',
        category: 'Bottoms',
        price: 69.99,
        description: `<h2>Classic Denim Jeans</h2>
<p>Timeless style meets modern comfort in these classic denim jeans.</p>

<h3>Features:</h3>
<ul>
  <li><strong>Premium Denim</strong> - High-quality fabric that lasts</li>
  <li><strong>Perfect Fit</strong> - Designed for all body types</li>
  <li><strong>Versatile Style</strong> - Dress up or down</li>
</ul>`,
        image: 'assets/images/instagram-2.jpeg',
        images: ['https://via.placeholder.com/400/1976D2/ffffff?text=Denim+Jeans'],
        isNew: false,
        colors: ['Blue', 'Black', 'Grey'],
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
        stockQuantity: 8,
        isOnSale: false
      }
    ];
    
    this.applyFilters();
    this.isLoading = false;
  }

  // Load products from API
  loadProducts(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiProducts = response.products || [];
        if (apiProducts.length > 0) {
          this.products = apiProducts;
        }
        this.applyFilters();
        console.log('Products loaded:', this.products.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.showError('Using demo products (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters and pagination
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
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.updatePaginatedProducts();
  }

  // Update paginated products
  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Category change
  onCategoryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Search
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterCategory = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Discount pricing methods
  getDiscountPercentage(product: Product): number {
    if (!product.discountPrice || product.discountPrice >= product.price) {
      return 0;
    }
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }

  isProductOnSale(product: Product): boolean {
    return !!(product.discountPrice && product.discountPrice < product.price);
  }

  getDisplayPrice(product: Product): number {
    if (this.isProductOnSale(product)) {
      return product.discountPrice!;
    }
    return product.price;
  }

  getSavingsAmount(product: Product): number {
    if (!this.isProductOnSale(product)) {
      return 0;
    }
    return product.price - product.discountPrice!;
  }

  // Product form methods
  addProduct(): void {
    this.isEditing = false;
    this.newProduct = this.getEmptyProduct();
    this.colorInput = '';
    this.additionalImage1 = '';
    this.additionalImage2 = '';
    this.showForm = true;
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.newProduct = { ...product };
    
    // Handle images array
    if (product.images && product.images.length > 0) {
      this.newProduct.image = product.images[0];
      this.additionalImage1 = product.images[1] || '';
      this.additionalImage2 = product.images[2] || '';
    }
    
    this.colorInput = '';
    this.showForm = true;
  }

  saveProduct(): void {
    // Validation
    if (!this.newProduct.name || !this.newProduct.category || !this.newProduct.price) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Validate discount price
    if (this.newProduct.discountPrice && this.newProduct.discountPrice >= this.newProduct.price) {
      this.showError('Discount price must be less than regular price');
      return;
    }

    // Build images array
    const images = [this.newProduct.image];
    if (this.additionalImage1) images.push(this.additionalImage1);
    if (this.additionalImage2) images.push(this.additionalImage2);
    this.newProduct.images = images;

    // Set isOnSale based on discount
    this.newProduct.isOnSale = this.isProductOnSale(this.newProduct);

    if (this.isEditing) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.http.post<any>(this.apiUrl, this.newProduct).subscribe({
      next: (response) => {
        this.showSuccess('Product created successfully!');
        this.loadProducts();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        // For demo: add to local array
        this.newProduct._id = 'PROD' + Date.now();
        this.products.push({ ...this.newProduct });
        this.applyFilters();
        this.showSuccess('Product created successfully! (Demo mode)');
        this.closeForm();
      }
    });
  }

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
        // For demo: update local array
        const index = this.products.findIndex(p => p._id === this.newProduct._id);
        if (index !== -1) {
          this.products[index] = { ...this.newProduct };
          this.applyFilters();
          this.showSuccess('Product updated successfully! (Demo mode)');
          this.closeForm();
        }
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    if (!product._id) return;

    this.http.delete<any>(`${this.apiUrl}/${product._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Product deleted successfully!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        // For demo: remove from local array
        this.products = this.products.filter(p => p._id !== product._id);
        this.applyFilters();
        this.showSuccess('Product deleted successfully! (Demo mode)');
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.newProduct = this.getEmptyProduct();
    this.colorInput = '';
    this.additionalImage1 = '';
    this.additionalImage2 = '';
  }

  // Size methods
  isSizeSelected(size: string): boolean {
    return this.newProduct.sizes.includes(size);
  }

  toggleSize(size: string): void {
    const index = this.newProduct.sizes.indexOf(size);
    if (index > -1) {
      this.newProduct.sizes.splice(index, 1);
    } else {
      this.newProduct.sizes.push(size);
    }
  }

  // Color methods
  addColorFromInput(): void {
    const color = this.colorInput.trim();
    if (color && !this.newProduct.colors.includes(color)) {
      this.newProduct.colors.push(color);
      this.colorInput = '';
    }
  }

  removeColor(color: string): void {
    this.newProduct.colors = this.newProduct.colors.filter(c => c !== color);
  }

  // Stock status methods
  getStockStatus(product: Product): string {
    if (!product.inStock || product.stockQuantity === 0) {
      return 'Out of Stock';
    }
    if (product.stockQuantity < 10) {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  getStockClass(product: Product): string {
    if (!product.inStock || product.stockQuantity === 0) {
      return 'out-of-stock';
    }
    if (product.stockQuantity < 10) {
      return 'low-stock';
    }
    return 'in-stock';
  }

  // Helper methods
  getEmptyProduct(): Product {
    return {
      name: '',
      category: 'Dresses',
      price: 0,
      discountPrice: undefined,
      description: '',
      image: '',
      images: [],
      isNew: false,
      colors: [],
      sizes: [],
      inStock: true,
      stockQuantity: 0,
      isOnSale: false
    };
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  getInitials(): string {
    return this.adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}