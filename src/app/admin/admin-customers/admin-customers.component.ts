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
  notificationCount = 5;
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

  // Modal
  showCustomerDetails = false;
  selectedCustomer: Customer | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/customers';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.addDemoCustomers();
    this.loadCustomers();
  }

  // Add demo customers
  addDemoCustomers(): void {
    this.customers = [
      {
        _id: 'CUST001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 234-5678',
        numberOfOrders: 12,
        totalSpent: 1245.50,
        status: 'active',
        joinDate: new Date('2023-01-15'),
        lastOrderDate: new Date('2024-03-05'),
        address: '123 Main St, New York, NY 10001'
      },
      {
        _id: 'CUST002',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 876-5432',
        numberOfOrders: 8,
        totalSpent: 892.30,
        status: 'active',
        joinDate: new Date('2023-03-20'),
        lastOrderDate: new Date('2024-03-08'),
        address: '456 Oak Ave, Los Angeles, CA 90001'
      },
      {
        _id: 'CUST003',
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 345-6789',
        numberOfOrders: 15,
        totalSpent: 2150.75,
        status: 'active',
        joinDate: new Date('2022-11-10'),
        lastOrderDate: new Date('2024-03-10'),
        address: '789 Pine Rd, Chicago, IL 60601'
      },
      {
        _id: 'CUST004',
        name: 'James Brown',
        email: 'james.brown@example.com',
        phone: '+1 (555) 567-8901',
        numberOfOrders: 3,
        totalSpent: 215.00,
        status: 'active',
        joinDate: new Date('2024-01-05'),
        lastOrderDate: new Date('2024-02-20'),
        address: '321 Elm St, Houston, TX 77001'
      },
      {
        _id: 'CUST005',
        name: 'Olivia Martinez',
        email: 'olivia.martinez@example.com',
        phone: '+1 (555) 789-0123',
        numberOfOrders: 20,
        totalSpent: 3420.90,
        status: 'active',
        joinDate: new Date('2022-08-15'),
        lastOrderDate: new Date('2024-03-09'),
        address: '654 Maple Dr, Miami, FL 33101'
      },
      {
        _id: 'CUST006',
        name: 'David Lee',
        email: 'david.lee@example.com',
        phone: '+1 (555) 234-9876',
        numberOfOrders: 1,
        totalSpent: 89.99,
        status: 'blocked',
        joinDate: new Date('2024-02-10'),
        lastOrderDate: new Date('2024-02-15'),
        address: '987 Cedar Ln, Seattle, WA 98101'
      }
    ];

    this.applyFilters();
    this.isLoading = false;
  }

  // Load customers from API
  loadCustomers(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiCustomers = response.customers || [];
        if (apiCustomers.length > 0) {
          this.customers = apiCustomers;
        }
        this.applyFilters();
        console.log('Customers loaded:', this.customers.length);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.showError('Using demo customers (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters
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
    this.updatePaginatedCustomers();
  }

  // Update paginated customers
  updatePaginatedCustomers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  // View customer details
  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showCustomerDetails = true;
  }

  // Close customer details
  closeCustomerDetails(): void {
    this.showCustomerDetails = false;
    this.selectedCustomer = null;
  }

  // Block customer
  blockCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to block ${customer.name}?`)) {
      return;
    }

    if (!customer._id) return;

    this.http.put<any>(`${this.apiUrl}/${customer._id}`, {
      status: 'blocked'
    }).subscribe({
      next: (response) => {
        customer.status = 'blocked';
        this.applyFilters();
        this.showSuccess('Customer blocked successfully!');
      },
      error: (error) => {
        console.error('Error blocking customer:', error);
        customer.status = 'blocked';
        this.applyFilters();
        this.showSuccess('Customer blocked successfully! (Demo mode)');
      }
    });
  }

  // Unblock customer
  unblockCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to unblock ${customer.name}?`)) {
      return;
    }

    if (!customer._id) return;

    this.http.put<any>(`${this.apiUrl}/${customer._id}`, {
      status: 'active'
    }).subscribe({
      next: (response) => {
        customer.status = 'active';
        this.applyFilters();
        this.showSuccess('Customer unblocked successfully!');
      },
      error: (error) => {
        console.error('Error unblocking customer:', error);
        customer.status = 'active';
        this.applyFilters();
        this.showSuccess('Customer unblocked successfully! (Demo mode)');
      }
    });
  }

  // Delete customer
  deleteCustomer(customer: Customer, event?: Event): void {
    if (event) event.stopPropagation();

    if (!confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      return;
    }

    if (!customer._id) return;

    this.http.delete<any>(`${this.apiUrl}/${customer._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Customer deleted successfully!');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        this.customers = this.customers.filter(c => c._id !== customer._id);
        this.applyFilters();
        this.showSuccess('Customer deleted successfully! (Demo mode)');
      }
    });
  }

  // Get status count
  getStatusCount(status: string): number {
    if (status === 'all') return this.customers.length;
    return this.customers.filter(c => c.status === status).length;
  }

  // Get status class
  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-blocked';
  }

  // Get status label
  getStatusLabel(status: string): string {
    return status === 'active' ? 'Active' : 'Blocked';
  }

  // Format currency
  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  // Pagination
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

  // Search
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Clear filters
  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Messages
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  // Navigation
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