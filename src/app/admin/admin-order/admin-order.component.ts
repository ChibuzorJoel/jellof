import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Order {
  _id?: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date | string;
  notes?: string;
}

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
  private contactMessages: any[] = [];
  
  // Orders
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Filter & Search
  searchQuery = '';
  filterStatus: string = 'all';
  
  // Modal
  showOrderDetails = false;
  selectedOrder: Order | null = null;
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // Loading
  isLoading = true;
  
  // API URL
  private apiUrl = 'http://localhost:3000/api/orders';
  private contactApiUrl = 'http://localhost:3000/api/contact';
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Add demo orders first
    this.addDemoOrders();
    // Then load real orders
    this.loadOrders();
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
  addDemoOrders(): void {
    // Add 2 demo orders
    this.orders = [
      {
        _id: 'ORDER001',
        customer: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@example.com'
        },
        items: [
          {
            productName: 'Floral Summer Dress',
            price: 89.99,
            quantity: 2,
            size: 'M',
            color: 'Pink'
          },
          {
            productName: 'Cotton T-Shirt',
            price: 29.99,
            quantity: 1,
            size: 'S',
            color: 'White'
          }
        ],
        totalAmount: 209.97,
        orderStatus: 'processing',
        createdAt: new Date('2024-03-01T10:30:00'),
        notes: 'Please deliver before weekend'
      },
      {
        _id: 'ORDER002',
        customer: {
          firstName: 'Michael',
          lastName: 'Chen',
          phone: '+1 (555) 987-6543',
          email: 'michael.chen@example.com'
        },
        items: [
          {
            productName: 'Classic Denim Jeans',
            price: 69.99,
            quantity: 1,
            size: 'L',
            color: 'Blue'
          }
        ],
        totalAmount: 69.99,
        orderStatus: 'delivered',
        createdAt: new Date('2024-02-28T15:45:00'),
        notes: ''
      }
    ];
    
    this.filteredOrders = [...this.orders];
    this.isLoading = false;
  }

  // Load all orders from API
  loadOrders(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        // Merge API orders with demo orders (if any)
        const apiOrders = response.orders || [];
        // Only replace with API orders if they exist, otherwise keep demo orders
        if (apiOrders.length > 0) {
          this.orders = apiOrders;
        }
        // If no API orders, demo orders stay from addDemoOrders()
        this.applyFilters();
        console.log('Orders loaded:', this.orders.length);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        // On error, keep demo orders
        this.showError('Using demo orders (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters
  applyFilters(): void {
    let filtered = [...this.orders];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(o => o.orderStatus === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(query) ||
        o.customer.phone.toLowerCase().includes(query) ||
        o.customer.email.toLowerCase().includes(query) ||
        o.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }

    this.filteredOrders = filtered;
  }

  // Filter by status
  filterByStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  // Search
  onSearch(): void {
    this.applyFilters();
  }

  // Get status count
  getStatusCount(status: string): number {
    if (status === 'all') return this.orders.length;
    return this.orders.filter(o => o.orderStatus === status).length;
  }

  // Get status color
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'processing': '#3b82f6',
      'shipped': '#8b5cf6',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#808080';
  }

  // View order details
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  // Close order details
  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  // Update order status
  updateStatus(order: Order, newStatus: string): void {
    if (!order._id) return;

    this.http.put<any>(`${this.apiUrl}/${order._id}`, {
      orderStatus: newStatus
    }).subscribe({
      next: (response) => {
        order.orderStatus = newStatus as any;
        this.showSuccess(`Order status updated to ${newStatus}!`);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.showError('Failed to update order status');
      }
    });
  }

  // Delete order
  deleteOrder(order: Order): void {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    if (!order._id) return;

    this.http.delete<any>(`${this.apiUrl}/${order._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Order deleted successfully!');
        this.closeOrderDetails();
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        this.showError('Failed to delete order');
      }
    });
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
    
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}