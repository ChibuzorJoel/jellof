import { Component, OnInit } from '@angular/core';
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
  
  // API URL
  private apiUrl = 'http://localhost:3000/api/products';
  
  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load all products from API
  loadProducts(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        this.products = response.products || [];
        this.applyFilters();
        console.log('Products loaded:', this.products.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.showError('Failed to load products');
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
  }

  // Show create form
  showCreateForm(): void {
    this.newProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.showForm = true;
  }

  // Show edit form
  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.editingProduct = product;
    this.isEditing = true;
    this.showForm = true;
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

  // Add color
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
    this.applyFilters();
  }

  // Filter by category
  onCategoryChange(): void {
    this.applyFilters();
  }
}