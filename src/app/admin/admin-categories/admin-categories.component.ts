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
  apiConnected = false;
  private contactMessages: any[] = [];

  private apiUrl = 'http://localhost:3000/api/categories';
  private contactApiUrl = 'http://localhost:3000/api/contact';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkBackendConnection();
    this.loadNotificationCount();
  }
 // ================= DYNAMIC NOTIFICATION COUNT =================
  
 get notificationCount(): number {
  return this.contactMessages.filter(c => c.status === 'new').length;
}

loadNotificationCount(): void {
  this.http.get<any>(this.contactApiUrl).subscribe({
    next: (response) => {
      this.contactMessages = response.contacts || [];
      console.log(`🔔 Notification count: ${this.notificationCount} new messages`);
    },
    error: (error) => {
      console.log('ℹ️ Could not load notification count');
      this.contactMessages = [];
    }
  });
}
  // ================= CHECK BACKEND =================
  checkBackendConnection(): void {
    console.log('🔍 Checking backend connection...');
    console.log('📍 Testing: http://localhost:3000/api/test');
    
    this.http.get<any>('http://localhost:3000/api/test').subscribe({
      next: (response) => {
        console.log('✅ Backend connected:', response);
        this.apiConnected = true;
        
        if (response.database === 'Connected') {
          console.log('✅ MongoDB is connected');
          this.loadCategories();
        } else {
          console.error('❌ MongoDB not connected!');
          this.showError('⚠️ Backend running but MongoDB disconnected!');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ Backend not reachable:', error);
        this.apiConnected = false;
        this.isLoading = false;
        this.showError(`❌ Backend not running!

Start backend:
  cd backend
  npm run dev

Expected output:
  ✅ Server running on port 3000
  ✅ MongoDB connected`);
        
        this.addDemoCategories();
      }
    });
  }

  // ================= DEMO DATA =================
  addDemoCategories(): void {
    this.categories = [
      {
        _id: 'DEMO-001',
        name: '⚠️ Demo: Dresses',
        description: 'Backend not connected - demo data only',
        productCount: 0,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.filteredCategories = [...this.categories];
    console.log('📦 Using demo categories (backend unavailable)');
  }

  // ================= LOAD API =================
  loadCategories(): void {
    console.log('🔄 Loading categories from:', this.apiUrl);

    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);

        const apiCategories = response.categories || response || [];
        
        if (apiCategories.length > 0) {
          this.categories = apiCategories;
          console.log(`✅ Loaded ${apiCategories.length} categories from MongoDB`);
          console.log('📦 Categories:', this.categories.map(c => c.name));
        } else {
          console.log('ℹ️ No categories in database yet - start by adding one!');
          this.categories = [];
        }

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load categories:', error);
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        
        this.isLoading = false;
        
        if (error.status === 0) {
          this.showError('❌ Cannot reach API endpoint!');
        } else if (error.status === 404) {
          this.showError(`❌ API endpoint not found!

Add to backend/server.js:

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);`);
        }
        
        this.addDemoCategories();
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
    if (!this.apiConnected) {
      this.showError('❌ Backend not connected! Start server first');
      return;
    }

    this.newCategory = this.getEmptyCategory();
    this.isEditing = false;
    this.showForm = true;
  }

  // ================= CREATE =================
  createCategory(): void {
    // Validation
    if (!this.newCategory.name?.trim() || !this.newCategory.description?.trim()) {
      this.showError('❌ Name and description are required');
      return;
    }

    if (!this.apiConnected) {
      this.showError('❌ Backend not connected!');
      return;
    }

    const payload = {
      name: this.newCategory.name.trim(),
      description: this.newCategory.description.trim(),
      isActive: this.newCategory.isActive
    };

    console.log('═══════════════════════════════');
    console.log('🔄 CREATING CATEGORY');
    console.log('═══════════════════════════════');
    console.log('📍 URL:', this.apiUrl);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    console.log('═══════════════════════════════');

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('═══════════════════════════════');
        console.log('✅ SUCCESS - CATEGORY CREATED!');
        console.log('═══════════════════════════════');
        console.log('📥 Response:', JSON.stringify(response, null, 2));
        
        const created = response.category || response.data || response;
        
        if (created._id) {
          console.log('💾 MongoDB ID:', created._id);
          console.log('✅ Category saved to database!');
          console.log('');
          console.log('🔍 VERIFY IN MONGODB COMPASS:');
          console.log('   Database: jellof-fashion');
          console.log('   Collection: categories');
          console.log('   Document ID:', created._id);
          console.log('═══════════════════════════════');
          
          // Add to UI
          this.categories.unshift(created);
          this.applyFilters();
          this.showSuccess(`✅ "${created.name}" saved to MongoDB!`);
          this.closeForm();
        } else {
          console.warn('⚠️ No _id in response - category may not be saved!');
          this.showError('⚠️ Category created but no ID returned');
        }
      },

      error: (error) => {
        console.log('═══════════════════════════════');
        console.log('❌ ERROR - CATEGORY NOT SAVED');
        console.log('═══════════════════════════════');
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        console.error('Message:', error.message);
        console.error('Error:', error.error);
        console.log('═══════════════════════════════');

        // User-friendly error messages
        if (error.status === 0) {
          this.showError(`❌ BACKEND NOT RESPONDING!

1. Check if backend is running:
   cd backend
   npm run dev

2. Should see:
   ✅ Server running on port 3000
   ✅ MongoDB connected

3. Test manually:
   http://localhost:3000/api/test`);
          
        } else if (error.status === 404) {
          this.showError(`❌ API ENDPOINT NOT FOUND!

In backend/server.js, add:

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

Then restart: npm run dev`);
          
        } else if (error.status === 500) {
          this.showError(`❌ SERVER ERROR!

Check backend console for errors.

Common causes:
1. MongoDB not running
   → brew services start mongodb-community
   
2. Model not imported
   → const Category = require('./models/Category');
   
3. Route not exported
   → module.exports = router;`);
          
        } else {
          this.showError(`❌ ${error.error?.message || error.message}`);
        }
      }
    });
  }

  // ================= UPDATE =================
  updateCategory(): void {
    if (!this.newCategory._id || this.newCategory._id.startsWith('DEMO-')) {
      this.showError('❌ Cannot update demo categories');
      return;
    }

    console.log('🔄 Updating category:', this.newCategory._id);

    this.http.put<any>(
      `${this.apiUrl}/${this.newCategory._id}`,
      this.newCategory
    ).subscribe({
      next: (response) => {
        console.log('✅ Category updated:', response);

        const index = this.categories.findIndex(c => c._id === this.newCategory._id);
        if (index !== -1) {
          this.categories[index] = { ...response.category || this.newCategory };
        }

        this.applyFilters();
        this.showSuccess('✅ Category updated in MongoDB!');
        this.closeForm();
      },
      error: (error) => {
        console.error('❌ Update failed:', error);
        this.showError(`❌ ${error.error?.message || 'Failed to update'}`);
      }
    });
  }

  // ================= EDIT =================
  editCategory(category: Category): void {
    if (category._id?.startsWith('DEMO-')) {
      this.showError('❌ Cannot edit demo categories. Connect backend first.');
      return;
    }

    this.newCategory = { ...category };
    this.editingCategory = category;
    this.isEditing = true;
    this.showForm = true;
  }

  // ================= DELETE =================
  deleteCategory(category: Category): void {
    if (!confirm(`Delete "${category.name}"?`)) return;

    if (category._id?.startsWith('DEMO-')) {
      this.showError('❌ Cannot delete demo categories');
      return;
    }

    console.log('🗑️ Deleting category:', category._id);

    this.http.delete<any>(`${this.apiUrl}/${category._id}`).subscribe({
      next: () => {
        console.log('✅ Category deleted from MongoDB');
        this.categories = this.categories.filter(c => c._id !== category._id);
        this.applyFilters();
        this.showSuccess('✅ Category deleted!');
      },
      error: (error) => {
        console.error('❌ Delete failed:', error);
        this.showError(`❌ ${error.error?.message || 'Failed to delete'}`);
      }
    });
  }

  // ================= TOGGLE STATUS =================
  toggleStatus(category: Category): void {
    if (category._id?.startsWith('DEMO-')) {
      this.showError('❌ Cannot modify demo categories');
      return;
    }

    const newStatus = !category.isActive;
    
    this.http.put<any>(
      `${this.apiUrl}/${category._id}`,
      { ...category, isActive: newStatus }
    ).subscribe({
      next: () => {
        category.isActive = newStatus;
        this.showSuccess(`✅ ${newStatus ? 'Activated' : 'Deactivated'}`);
      },
      error: (error) => {
        this.showError('❌ Failed to update status');
      }
    });
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

  getInitials(): string {
    return this.adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  // ================= MESSAGES =================
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 10000);
  }

  // ================= DATE =================
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}