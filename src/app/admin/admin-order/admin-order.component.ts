import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from 'src/app/models/order-model';

interface StatusCounts {
  [key: string]: number; // <-- Allow dynamic indexing
  all: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  // Filters
  filterStatus: string = 'all';
  searchQuery: string = '';

  // Stats
  statusCounts: StatusCounts = {
    all: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  // UI states
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Selected order
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /* ================= LOAD ORDERS ================= */
  loadOrders(): void {
    this.isLoading = true;

    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        this.orders = response.orders || [];
        this.calculateStatusCounts();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.showError('Failed to load orders');
        this.isLoading = false;
      }
    });
  }

  /* ================= STATS ================= */
  calculateStatusCounts(): void {
    this.statusCounts.all = this.orders.length;
    this.statusCounts.pending = this.orders.filter(o => o.orderStatus === 'pending').length;
    this.statusCounts.confirmed = this.orders.filter(o => o.orderStatus === 'confirmed').length;
    this.statusCounts.processing = this.orders.filter(o => o.orderStatus === 'processing').length;
    this.statusCounts.shipped = this.orders.filter(o => o.orderStatus === 'shipped').length;
    this.statusCounts.delivered = this.orders.filter(o => o.orderStatus === 'delivered').length;
    this.statusCounts.cancelled = this.orders.filter(o => o.orderStatus === 'cancelled').length;
  }

  /* ================= FILTERS ================= */
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
        o.customer.firstName.toLowerCase().includes(query) ||
        o.customer.lastName.toLowerCase().includes(query) ||
        o.customer.phone.includes(query) ||
        o.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }

    this.filteredOrders = filtered;
  }

  filterByStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  /* ================= DETAILS ================= */
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  /* ================= ACTIONS ================= */
  updateStatus(order: Order, newStatus: string): void {
    if (!order._id) return;

    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: () => {
        this.showSuccess(`Order status updated to ${newStatus}`);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.showError('Failed to update order status');
      }
    });
  }

  deleteOrder(order: Order): void {
    if (!order._id) return;
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.orderService.deleteOrder(order._id).subscribe({
      next: () => {
        this.showSuccess('Order deleted successfully');
        this.loadOrders();
        this.closeOrderDetails();
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        this.showError('Failed to delete order');
      }
    });
  }

  /* ================= HELPERS ================= */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  }
  getStatusCount(status: string): number {
    return this.statusCounts[status as keyof StatusCounts] || 0;
  }
  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => (this.errorMessage = ''), 5000);
  }
}
