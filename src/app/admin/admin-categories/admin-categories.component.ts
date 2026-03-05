import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Category {
  _id?: string;
  name: string;
  description: string;
  productCount?: number;
  isActive: boolean;
  createdAt?: Date | string;
}

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
  notificationCount = 5;
  
  // Categories
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  
  // Form states
  isEditing = false;
  editingCategory: Category | null = null;
  showForm = false;
  
  // New category form
  newCategory: Category = this.getEmptyCategory();
  
  // Search
  searchQuery = '';
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // Loading
  isLoading = true;
  
  // API URL
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Add demo categories first
    this.addDemoCategories();
    // Then load real categories
    this.loadCategories();
  }

  addDemoCategories(): void {
    // Add demo categories
    this.categories = [
      {
        _id: 'CAT001',
        name: 'Dresses',
        description: 'Beautiful dresses for every occasion',
        productCount: 45,
        isActive: true,
        createdAt: new Date('2024-01-15')
      },
      {
        _id: 'CAT002',
        name: 'Tops',
        description: 'Stylish tops and blouses',
        productCount: 38,
        isActive: true,
        createdAt: new Date('2024-01-16')
      },
      {
        _id: 'CAT003',
        name: 'Bottoms',
        description: 'Jeans, pants, and skirts',
        productCount: 32,
        isActive: true,
        createdAt: new Date('2024-01-17')
      },
      {
        _id: 'CAT004',
        name: 'Outerwear',
        description: 'Jackets, coats, and cardigans',
        productCount: 18,
        isActive: true,
        createdAt: new Date('2024-01-18')
      },
      {
        _id: 'CAT005',
        name: 'Accessories',
        description: 'Bags, jewelry, and scarves',
        productCount: 56,
        isActive: false,
        createdAt: new Date('2024-01-19')
      }
    ];
    
    this.filteredCategories = [...this.categories];
    this.isLoading = false;
  }

  // Load all categories from API
  loadCategories(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        // Merge API categories with demo categories (if any)
        const apiCategories = response.categories || [];
        // Only replace with API categories if they exist, otherwise keep demo
        if (apiCategories.length > 0) {
          this.categories = apiCategories;
        }
        this.applyFilters();
        console.log('Categories loaded:', this.categories.length);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // On error, keep demo categories
        this.showError('Using demo categories (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply search filter
  applyFilters(): void {
    let filtered = [...this.categories];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    this.filteredCategories = filtered;
  }

  // Show create form
  addCategory(): void {
    this.newCategory = this.getEmptyCategory();
    this.isEditing = false;
    this.showForm = true;
  }

  // Show edit form
  editCategory(category: Category): void {
    this.newCategory = { ...category };
    this.editingCategory = category;
    this.isEditing = true;
    this.showForm = true;
  }

  // Create new category
  createCategory(): void {
    this.http.post<any>(this.apiUrl, this.newCategory).subscribe({
      next: (response) => {
        this.showSuccess('Category created successfully!');
        this.loadCategories();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.showError('Failed to create category');
      }
    });
  }

  // Update existing category
  updateCategory(): void {
    if (!this.newCategory._id) return;

    this.http.put<any>(`${this.apiUrl}/${this.newCategory._id}`, this.newCategory).subscribe({
      next: (response) => {
        this.showSuccess('Category updated successfully!');
        this.loadCategories();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.showError('Failed to update category');
      }
    });
  }

  // Delete category
  deleteCategory(category: Category): void {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    this.http.delete<any>(`${this.apiUrl}/${category._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Category deleted successfully!');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.showError('Failed to delete category');
      }
    });
  }

  // Toggle category status
  toggleStatus(category: Category): void {
    category.isActive = !category.isActive;
    
    if (category._id) {
      this.http.put<any>(`${this.apiUrl}/${category._id}`, category).subscribe({
        next: (response) => {
          this.showSuccess(`Category ${category.isActive ? 'activated' : 'deactivated'}!`);
        },
        error: (error) => {
          console.error('Error updating status:', error);
          category.isActive = !category.isActive; // Revert on error
          this.showError('Failed to update category status');
        }
      });
    }
  }

  // Save category (create or update)
  saveCategory(): void {
    if (this.isEditing) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  // Close form
  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingCategory = null;
    this.newCategory = this.getEmptyCategory();
  }

  // Get empty category template
  getEmptyCategory(): Category {
    return {
      name: '',
      description: '',
      productCount: 0,
      isActive: true
    };
  }

  // Search
  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
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

  // Show messages
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // Format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}