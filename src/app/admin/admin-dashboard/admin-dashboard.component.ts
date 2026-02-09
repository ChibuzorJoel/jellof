import { Component, OnInit } from '@angular/core';
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
  recentOrders: any[];
  recentContacts: any[];
  popularProducts: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalContacts: 0,
    totalSubscribers: 0,
    ordersToday: 0,
    ordersThisWeek: 0,
    ordersThisMonth: 0,
    recentOrders: [],
    recentContacts: [],
    popularProducts: []
  };

  isLoading = true;

  constructor(
    private productService: ProductService,
    private contactService: ContactService,
    private newsletterService: NewsletterService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;

    // Load all stats in parallel
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
          this.stats.totalProducts = response.count;
          this.stats.popularProducts = response.products.slice(0, 5);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadOrders(): Promise<void> {
    return new Promise((resolve) => {
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          this.stats.totalOrders = response.orders.length;
          this.stats.recentOrders = response.orders.slice(0, 5);
          
          // Calculate time-based stats
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

          this.stats.ordersToday = response.orders.filter(o => 
            new Date(o.createdAt!) >= today
          ).length;
          
          this.stats.ordersThisWeek = response.orders.filter(o => 
            new Date(o.createdAt!) >= weekAgo
          ).length;
          
          this.stats.ordersThisMonth = response.orders.filter(o => 
            new Date(o.createdAt!) >= monthAgo
          ).length;

          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadContacts(): Promise<void> {
    return new Promise((resolve) => {
      this.contactService.getAllContacts().subscribe({
        next: (response) => {
          this.stats.totalContacts = response.count;
          this.stats.recentContacts = response.contacts.slice(0, 5);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadSubscribers(): Promise<void> {
    return new Promise((resolve) => {
      this.newsletterService.getAllSubscribers().subscribe({
        next: (response) => {
          this.stats.totalSubscribers = response.count;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': '#FFA500',
      'confirmed': '#4CAF50',
      'processing': '#2196F3',
      'shipped': '#9C27B0',
      'delivered': '#4CAF50',
      'cancelled': '#F44336',
      'new': '#2196F3',
      'read': '#4CAF50'
    };
    return colors[status] || '#666';
  }

}
