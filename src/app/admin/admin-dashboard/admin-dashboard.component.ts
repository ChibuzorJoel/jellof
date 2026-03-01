import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ContactService } from '../../services/contact.service';
import { NewsletterService } from '../../services/newsletter.service';
import { OrderService } from '../../services/order.service';

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

interface Contact {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Date | string;
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

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  adminName = 'Admin';
  lastUpdated = new Date();
  selectedPeriod = 'month';
  isLoading = true;
  
  // New properties
  searchQuery = '';
  notificationCount = 5;
  showProfileMenu = false;
  showNotifications = false;

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
  recentContacts: Contact[] = [];
  popularProducts: any[] = [];

  Math = Math;

  constructor(
    private router: Router,
    private productService: ProductService,
    private contactService: ContactService,
    private newsletterService: NewsletterService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.lastUpdated = new Date();

    Promise.all([
      this.loadProducts(),
      this.loadOrders(),
      this.loadContacts(),
      this.loadSubscribers()
    ]).then(() => {
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading dashboard stats:', error);
      this.isLoading = false;
    });
  }

  loadProducts(): Promise<void> {
    return new Promise((resolve) => {
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          this.stats.totalProducts = response.count || response.products?.length || 0;
          this.popularProducts = response.products?.slice(0, 5) || [];
          
          this.lowStockProducts = response.products
            ?.filter((p: any) => p.stock < 10)
            .map((p: any) => ({
              id: p.id || p._id,
              _id: p._id || p.id,
              name: p.name,
              category: p.category,
              stock: p.stock,
              image: p.image || p.images?.[0] || 'assets/images/placeholder.jpg',
              minStock: p.minStock || 10
            }))
            .slice(0, 5) || [];
          
          this.stats.productsChange = this.calculateRandomChange();
          resolve();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          resolve();
        }
      });
    });
  }

  loadOrders(): Promise<void> {
    return new Promise((resolve) => {
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          const orders = response.orders || [];
          this.stats.totalOrders = orders.length;
          
          this.recentOrders = orders
            .slice(0, 5)
            .map((o: any) => ({
              id: o.id || o._id,
              _id: o._id || o.id,
              customerName: o.customerName || o.shippingAddress?.fullName || 'Unknown',
              customerEmail: o.customerEmail || o.email || '',
              total: o.total || o.totalAmount || 0,
              status: o.status || 'pending',
              createdAt: o.createdAt,
              items: o.items || []
            }));
          
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

          this.stats.ordersToday = orders.filter((o: any) => 
            new Date(o.createdAt!) >= today
          ).length;
          
          this.stats.ordersThisWeek = orders.filter((o: any) => 
            new Date(o.createdAt!) >= weekAgo
          ).length;
          
          this.stats.ordersThisMonth = orders.filter((o: any) => 
            new Date(o.createdAt!) >= monthAgo
          ).length;

          this.stats.totalSales = orders.reduce((sum: number, o: any) => 
            sum + (o.total || o.totalAmount || 0), 0
          );

          this.stats.ordersChange = this.calculateRandomChange();
          this.stats.salesChange = this.calculateRandomChange();
          resolve();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          resolve();
        }
      });
    });
  }

  loadContacts(): Promise<void> {
    return new Promise((resolve) => {
      this.contactService.getAllContacts().subscribe({
        next: (response) => {
          this.stats.totalContacts = response.count || response.contacts?.length || 0;
          
          this.recentContacts = response.contacts
            ?.slice(0, 5)
            .map((c: any) => ({
              id: c.id || c._id,
              _id: c._id || c.id,
              name: c.name,
              email: c.email,
              subject: c.subject,
              message: c.message,
              status: c.status || 'new',
              createdAt: c.createdAt
            })) || [];

          this.stats.contactsChange = this.calculateRandomChange();
          resolve();
        },
        error: (error) => {
          console.error('Error loading contacts:', error);
          resolve();
        }
      });
    });
  }

  loadSubscribers(): Promise<void> {
    return new Promise((resolve) => {
      this.newsletterService.getAllSubscribers().subscribe({
        next: (response) => {
          this.stats.totalSubscribers = response.count || response.subscribers?.length || 0;
          resolve();
        },
        error: (error) => {
          console.error('Error loading subscribers:', error);
          resolve();
        }
      });
    });
  }

  private calculateRandomChange(): number {
    return Math.floor(Math.random() * 30) - 10;
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  changePeriod(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/admin/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
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

  exportReport(): void {
    alert('Exporting dashboard report...');
    console.log('Export report:', {
      stats: this.stats,
      orders: this.recentOrders,
      lowStock: this.lowStockProducts
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#FFA500',
      'confirmed': '#4CAF50',
      'processing': '#2196F3',
      'shipped': '#9C27B0',
      'delivered': '#4CAF50',
      'cancelled': '#F44336',
      'new': '#2196F3',
      'read': '#4CAF50',
      'replied': '#9C27B0'
    };
    return colors[status.toLowerCase()] || '#666';
  }

  getOrderStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status.toLowerCase()] || status;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}