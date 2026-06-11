import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  numberOfOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinDate: Date | string;
  lastOrderDate?: Date | string;
  address?: string;
}

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css']
})
export class AdminCustomersComponent implements OnInit {
  // Navigation
  adminName = 'Admin';
  
  searchQuery = '';

  // Customers
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];

  // Filters
  filterStatus: string = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  private contactMessages: any[] = [];

  // Modal
  showCustomerDetails = false;
  selectedCustomer: Customer | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/customers';
  private contactApiUrl = 'http://localhost:3000/api/contact';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('🔄 Loading real customers from database...');
    this.loadCustomers();
    this.loadNotificationCount();
  }

  /* ================= DYNAMIC NOTIFICATION COUNT ================= */
  
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

  /* ================= LOAD REAL CUSTOMERS FROM DATABASE ================= */
  
  loadCustomers(): void {
    console.log('📡 Fetching customers from API...');
    this.isLoading = true;

    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('✅ Customers API response:', response);
        
        if (response.success && response.customers) {
          this.customers = response.customers.map((customer: any) => ({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone || 'N/A',
            numberOfOrders: customer.numberOfOrders || 0,
            totalSpent: customer.totalSpent || 0,
            status: customer.status,
            joinDate: customer.joinDate,
            lastOrderDate: customer.lastOrderDate,
            address: customer.address || 'No address provided'
          }));

          console.log(`✅ Loaded ${this.customers.length} real customers from database`);
          
          if (this.customers.length === 0) {
            this.showError('No customers found in database. Register some users to see them here.');
          }
        } else {
          console.log('⚠️ No customers in response');
          this.customers = [];
          this.showError('No customers found in database');
        }

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading customers:', error);
        this.isLoading = false;
        this.customers = [];
        
        if (error.status === 0) {
          this.showError('Cannot connect to server. Please make sure backend is running on http://localhost:3000');
        } else if (error.status === 404) {
          this.showError('Customer API endpoint not found. Please check backend routes.');
        } else {
          this.showError('Failed to load customers. Please try again.');
        }
        
        this.applyFilters();
      }
    });
  }

  /* ================= FILTERS & SEARCH ================= */

  applyFilters(): void {
    let filtered = [...this.customers];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );
    }

    this.filteredCustomers = filtered;
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    
    // Reset to page 1 if current page exceeds total pages
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
    
    this.updatePaginatedCustomers();
  }

  /* ================= PAGINATION ================= */

  updatePaginatedCustomers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCustomers();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCustomers();
  }

  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  /* ================= CUSTOMER ACTIONS ================= */

  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showCustomerDetails = true;
  }

  closeCustomerDetails(): void {
    this.showCustomerDetails = false;
    this.selectedCustomer = null;
  }

  blockCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to block ${customer.name}?`)) {
      return;
    }

    if (!customer._id) return;

    console.log(`🚫 Blocking customer: ${customer.name}`);

    this.http.put<any>(`${this.apiUrl}/${customer._id}`, {
      status: 'blocked'
    }).subscribe({
      next: (response) => {
        console.log('✅ Customer blocked successfully:', response);
        customer.status = 'blocked';
        this.applyFilters();
        this.showSuccess(`${customer.name} has been blocked successfully!`);
      },
      error: (error) => {
        console.error('❌ Error blocking customer:', error);
        this.showError('Failed to block customer. Please try again.');
      }
    });
  }

  unblockCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to unblock ${customer.name}?`)) {
      return;
    }

    if (!customer._id) return;

    console.log(`✅ Unblocking customer: ${customer.name}`);

    this.http.put<any>(`${this.apiUrl}/${customer._id}`, {
      status: 'active'
    }).subscribe({
      next: (response) => {
        console.log('✅ Customer unblocked successfully:', response);
        customer.status = 'active';
        this.applyFilters();
        this.showSuccess(`${customer.name} has been unblocked successfully!`);
      },
      error: (error) => {
        console.error('❌ Error unblocking customer:', error);
        this.showError('Failed to unblock customer. Please try again.');
      }
    });
  }

  deleteCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to delete ${customer.name}?\n\nThis action cannot be undone and will permanently remove the customer and all their data.`)) {
      return;
    }

    if (!customer._id) return;

    console.log(`🗑️ Deleting customer: ${customer.name}`);

    this.http.delete<any>(`${this.apiUrl}/${customer._id}`).subscribe({
      next: (response) => {
        console.log('✅ Customer deleted successfully:', response);
        this.showSuccess(`${customer.name} has been deleted successfully!`);
        
        // Remove from local array
        this.customers = this.customers.filter(c => c._id !== customer._id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('❌ Error deleting customer:', error);
        this.showError('Failed to delete customer. Please try again.');
      }
    });
  }

  /* ================= UTILITY FUNCTIONS ================= */

  getStatusCount(status: string): number {
    if (status === 'all') return this.customers.length;
    return this.customers.filter(c => c.status === status).length;
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-blocked';
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Active' : 'Blocked';
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  /* ================= MESSAGES ================= */

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  /* ================= NAVIGATION ================= */

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