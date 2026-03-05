import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalContacts: number;
  totalSubscribers: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  totalSales: number;
  productsChange: number;
  ordersChange: number;
  contactsChange: number;
  salesChange: number;
}

interface Order {
  id?: string;
  _id?: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date | string;
  items?: any[];
}

interface LowStockProduct {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  stock: number;
  image: string;
  minStock?: number;
}

interface TopProduct {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  image: string;
  sales: number;
  revenue: number;
  rating?: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
  notificationCount = 5;
  searchQuery = '';

  // Dashboard data
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalContacts: 0,
    totalSubscribers: 0,
    ordersToday: 0,
    ordersThisWeek: 0,
    ordersThisMonth: 0,
    totalSales: 0,
    productsChange: 0,
    ordersChange: 0,
    contactsChange: 0,
    salesChange: 0
  };

  recentOrders: Order[] = [];
  lowStockProducts: LowStockProduct[] = [];
  topProducts: TopProduct[] = [];

  // Loading state
  isLoading = true;

  // API URLs
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Add demo data first for immediate display
    this.addDemoData();
    // Then load real data from API
    this.loadDashboardData();
  }

  // Add demo data for immediate display
  addDemoData(): void {
    // Demo statistics
    this.stats = {
      totalProducts: 125,
      totalOrders: 48,
      totalContacts: 23,
      totalSubscribers: 156,
      ordersToday: 5,
      ordersThisWeek: 18,
      ordersThisMonth: 48,
      totalSales: 12450.00,
      productsChange: 12,
      ordersChange: 17,
      contactsChange: -3,
      salesChange: 24
    };

    // Demo recent orders
    this.recentOrders = [
      {
        id: 'ORD001',
        _id: 'ORD001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        total: 299.99,
        status: 'delivered',
        createdAt: new Date('2024-03-01T10:30:00'),
        items: []
      },
      {
        id: 'ORD002',
        _id: 'ORD002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        total: 499.99,
        status: 'processing',
        createdAt: new Date('2024-03-01T14:15:00'),
        items: []
      },
      {
        id: 'ORD003',
        _id: 'ORD003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        total: 159.99,
        status: 'shipped',
        createdAt: new Date('2024-02-29T09:20:00'),
        items: []
      },
      {
        id: 'ORD004',
        _id: 'ORD004',
        customerName: 'Sarah Williams',
        customerEmail: 'sarah@example.com',
        total: 349.99,
        status: 'pending',
        createdAt: new Date('2024-02-29T16:45:00'),
        items: []
      },
      {
        id: 'ORD005',
        _id: 'ORD005',
        customerName: 'Tom Brown',
        customerEmail: 'tom@example.com',
        total: 199.99,
        status: 'confirmed',
        createdAt: new Date('2024-02-28T11:30:00'),
        items: []
      }
    ];

    // Demo low stock products
    this.lowStockProducts = [
      {
        id: '1',
        _id: '1',
        name: 'Summer Floral Dress',
        category: 'Dresses',
        stock: 5,
        image: 'https://via.placeholder.com/60/2d5016/ffffff?text=Dress',
        minStock: 10
      },
      {
        id: '2',
        _id: '2',
        name: 'Cotton T-Shirt',
        category: 'Tops',
        stock: 3,
        image: 'https://via.placeholder.com/60/1f3710/ffffff?text=TShirt',
        minStock: 10
      },
      {
        id: '3',
        _id: '3',
        name: 'Denim Jeans',
        category: 'Bottoms',
        stock: 7,
        image: 'https://via.placeholder.com/60/5fa832/ffffff?text=Jeans',
        minStock: 10
      },
      {
        id: '4',
        _id: '4',
        name: 'Leather Jacket',
        category: 'Outerwear',
        stock: 2,
        image: 'https://via.placeholder.com/60/6bc045/ffffff?text=Jacket',
        minStock: 10
      }
    ];

    // Demo top products
    this.topProducts = [
      {
        id: 'P1',
        _id: 'P1',
        name: 'Floral Summer Dress',
        category: 'Dresses',
        image: 'https://via.placeholder.com/50/2d5016/ffffff?text=D',
        sales: 145,
        revenue: 12955.50,
        rating: 4.8
      },
      {
        id: 'P2',
        _id: 'P2',
        name: 'Classic Denim Jeans',
        category: 'Bottoms',
        image: 'https://via.placeholder.com/50/1f3710/ffffff?text=J',
        sales: 132,
        revenue: 9228.00,
        rating: 4.7
      },
      {
        id: 'P3',
        _id: 'P3',
        name: 'Cotton T-Shirt',
        category: 'Tops',
        image: 'https://via.placeholder.com/50/5fa832/ffffff?text=T',
        sales: 98,
        revenue: 2940.00,
        rating: 4.6
      },
      {
        id: 'P4',
        _id: 'P4',
        name: 'Leather Handbag',
        category: 'Accessories',
        image: 'https://via.placeholder.com/50/6bc045/ffffff?text=H',
        sales: 76,
        revenue: 11400.00,
        rating: 4.9
      },
      {
        id: 'P5',
        _id: 'P5',
        name: 'Winter Coat',
        category: 'Outerwear',
        image: 'https://via.placeholder.com/50/4a7c2a/ffffff?text=C',
        sales: 54,
        revenue: 10800.00,
        rating: 4.5
      }
    ];

    this.isLoading = false;
  }

  // Load real dashboard data from API
  loadDashboardData(): void {
    // Load products
    this.http.get<any>(`${this.apiUrl}/products`).subscribe({
      next: (response) => {
        if (response.products && response.products.length > 0) {
          this.stats.totalProducts = response.products.length;
          
          // Update low stock products with real data
          const realLowStock = response.products.filter((p: any) => 
            p.stockQuantity < 10
          ).slice(0, 4);
          
          if (realLowStock.length > 0) {
            this.lowStockProducts = realLowStock.map((p: any) => ({
              id: p._id,
              _id: p._id,
              name: p.name,
              category: p.category,
              stock: p.stockQuantity,
              image: p.image || p.images?.[0] || 'assets/images/placeholder.jpg',
              minStock: 10
            }));
          }
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });

    // Load orders
    this.http.get<any>(`${this.apiUrl}/orders`).subscribe({
      next: (response) => {
        if (response.orders && response.orders.length > 0) {
          const orders = response.orders;
          this.stats.totalOrders = orders.length;
          
          // Calculate total sales
          this.stats.totalSales = orders.reduce((sum: number, order: any) => 
            sum + (order.totalAmount || 0), 0
          );
          
          // Get recent orders
          this.recentOrders = orders
            .sort((a: any, b: any) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map((o: any) => ({
              id: o._id,
              _id: o._id,
              customerName: `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer',
              customerEmail: o.customer?.email || '',
              total: o.totalAmount,
              status: o.orderStatus,
              createdAt: o.createdAt,
              items: o.items
            }));
          
          // Calculate orders today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          this.stats.ordersToday = orders.filter((o: any) => 
            new Date(o.createdAt) >= today
          ).length;
        }
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });

    // Load contacts
    this.http.get<any>(`${this.apiUrl}/contacts`).subscribe({
      next: (response) => {
        if (response.contacts) {
          this.stats.totalContacts = response.contacts.length;
        }
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });

    // Load newsletter subscribers
    this.http.get<any>(`${this.apiUrl}/newsletter`).subscribe({
      next: (response) => {
        if (response.subscribers) {
          this.stats.totalSubscribers = response.subscribers.length;
        }
      },
      error: (error) => {
        console.error('Error loading subscribers:', error);
      }
    });
  }

  // Refresh all dashboard data
  refreshData(): void {
    this.isLoading = true;
    this.loadDashboardData();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // Export report (placeholder)
  exportReport(): void {
    console.log('Exporting report...');
    alert('Export functionality will be implemented soon!');
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  performSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement search logic here
  }

  getInitials(): string {
    return this.adminName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      this.router.navigate(['/admin/login']);
    }
  }

  // Order status helpers
  getOrderStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'confirmed': '#3b82f6',
      'processing': '#3b82f6',
      'shipped': '#8b5cf6',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#808080';
  }

  getStatusCount(status: string): number {
    if (!this.recentOrders) return 0;
    return this.recentOrders.filter(o => o.status === status).length;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Math helpers
  Math = Math;
}