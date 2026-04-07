import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Category {
  _id?: string;
  name: string;
  description: string;
  productCount?: number;
  isActive: boolean;
  createdAt?: Date | string;
  icon?: string;         
  displayOrder?: number;
}

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  adminName = 'Admin';
  notificationCount = 5;

  categories: Category[] = [];
  filteredCategories: Category[] = [];

  isEditing = false;
  editingCategory: Category | null = null;
  showForm = false;

  newCategory: Category = this.getEmptyCategory();

  searchQuery = '';

  successMessage = '';
  errorMessage = '';

  isLoading = true;

  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.addDemoCategories();
    this.loadCategories();
  }

  // ================= DEMO DATA =================
  addDemoCategories(): void {
    this.categories = [
      {
        _id: 'CAT001',
        name: 'Dresses',
        description: 'Beautiful dresses for every occasion',
        productCount: 45,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: 'CAT002',
        name: 'Tops',
        description: 'Stylish tops and blouses',
        productCount: 38,
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: 'CAT003',
        name: 'Bottoms',
        description: 'Jeans, pants, and skirts',
        productCount: 32,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.filteredCategories = [...this.categories];
    this.isLoading = false;
  }

  // ================= LOAD API =================
  loadCategories(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiCategories = response.categories || response || [];

        this.categories = [
          ...this.categories,
          ...apiCategories
        ];

        this.applyFilters();
      },
      error: () => {
        this.showError('Using demo categories (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // ================= FILTER =================
  applyFilters(): void {
    let filtered = [...this.categories];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    this.filteredCategories = filtered;
  }

  // ================= ADD =================
  addCategory(): void {
    this.newCategory = this.getEmptyCategory();
    this.isEditing = false;
    this.showForm = true;
  }

  // ================= EDIT =================
  editCategory(category: Category): void {
    this.newCategory = { ...category };
    this.editingCategory = category;
    this.isEditing = true;
    this.showForm = true;
  }

  // ================= CREATE =================
  createCategory(): void {

    // validation
    if (!this.newCategory.name || !this.newCategory.description) {
      this.showError('Please fill all required fields');
      return;
    }
  
    const payload = {
      name: this.newCategory.name,
      description: this.newCategory.description,
      isActive: this.newCategory.isActive
    };
  
    console.log('Sending payload:', payload);
  
    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
  
        console.log('Create response:', response);
  
        const created: Category =
          response.category ||
          response.data ||
          response;
  
        // fallback id
        if (!created._id) {
          created._id = 'TEMP_' + Date.now();
        }
  
        // add instantly
        this.categories.unshift(created);
  
        this.applyFilters();
        this.showSuccess('Category created successfully!');
        this.closeForm();
      },
  
      error: (error) => {
  
        console.error('API failed — creating locally', error);
  
        // fallback create locally (so button always works)
        const localCategory: Category = {
          _id: 'LOCAL_' + Date.now(),
          name: this.newCategory.name,
          description: this.newCategory.description,
          isActive: this.newCategory.isActive,
          createdAt: new Date()
        };
  
        this.categories.unshift(localCategory);
  
        this.applyFilters();
        this.showSuccess('Category created locally');
        this.closeForm();
      }
    });
  }

  // ================= UPDATE =================
  updateCategory(): void {

    // DEMO CATEGORY
    if (!this.newCategory._id || this.newCategory._id.startsWith('CAT')) {

      const index = this.categories.findIndex(
        c => c._id === this.newCategory._id
      );

      if (index !== -1) {
        this.categories[index] = { ...this.newCategory };
      }

      this.applyFilters();
      this.showSuccess('Demo category updated!');
      this.closeForm();
      return;
    }

    // API CATEGORY
    this.http.put<any>(
      `${this.apiUrl}/${this.newCategory._id}`,
      this.newCategory
    ).subscribe({
      next: () => {

        const index = this.categories.findIndex(
          c => c._id === this.newCategory._id
        );

        if (index !== -1) {
          this.categories[index] = { ...this.newCategory };
        }

        this.applyFilters();
        this.showSuccess('Category updated successfully!');
        this.closeForm();
      },
      error: () => {
        this.showError('Failed to update category');
      }
    });
  }
  toggleStatus(category: Category): void {

    // DEMO CATEGORY
    if (!category._id || category._id.startsWith('CAT')) {
      category.isActive = !category.isActive;
      this.showSuccess('Demo category status updated!');
      return;
    }
  
    category.isActive = !category.isActive;
  
    this.http.put<any>(
      `${this.apiUrl}/${category._id}`,
      category
    ).subscribe({
      next: () => {
        this.showSuccess(
          `Category ${category.isActive ? 'activated' : 'deactivated'}!`
        );
      },
      error: () => {
        category.isActive = !category.isActive;
        this.showError('Failed to update category status');
      }
    });
  }
  // ================= DELETE =================
  deleteCategory(category: Category): void {

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    // DEMO CATEGORY
    if (!category._id || category._id.startsWith('CAT')) {

      this.categories = this.categories.filter(
        c => c._id !== category._id
      );

      this.applyFilters();
      this.showSuccess('Demo category deleted!');
      return;
    }

    // API CATEGORY
    this.http.delete<any>(
      `${this.apiUrl}/${category._id}`
    ).subscribe({
      next: () => {

        this.categories = this.categories.filter(
          c => c._id !== category._id
        );

        this.applyFilters();
        this.showSuccess('Category deleted successfully!');
      },
      error: () => {
        this.showError('Failed to delete category');
      }
    });
  }
  getInitials(): string {
    return this.adminName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
  // ================= SAVE =================
  saveCategory(): void {
    if (this.isEditing) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  // ================= CLOSE =================
  closeForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingCategory = null;
    this.newCategory = this.getEmptyCategory();
  }

  getEmptyCategory(): Category {
    return {
      name: '',
      description: '',
      productCount: 0,
      isActive: true
    };
  }

  // ================= SEARCH =================
  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  // ================= NAV =================
  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  // ================= MESSAGES =================
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // ================= DATE =================
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}