import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Filter states
  filterStatus: string = 'all';
  searchQuery: string = '';
  
  // Stats
  statusCounts: any = {
    all: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  
  // Loading & messages
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  // Selected order for details
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

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

  calculateStatusCounts(): void {
    this.statusCounts.all = this.orders.length;
    this.statusCounts.pending = this.orders.filter(o => o.status === 'pending').length;
    this.statusCounts.confirmed = this.orders.filter(o => o.status === 'confirmed').length;
    this.statusCounts.processing = this.orders.filter(o => o.status === 'processing').length;
    this.statusCounts.shipped = this.orders.filter(o => o.status === 'shipped').length;
    this.statusCounts.delivered = this.orders.filter(o => o.status === 'delivered').length;
    this.statusCounts.cancelled = this.orders.filter(o => o.status === 'cancelled').length;
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        (o.customerName && o.customerName.toLowerCase().includes(query)) ||
        (o.customerPhone && o.customerPhone.toLowerCase().includes(query)) ||
        (o.productName && o.productName.toLowerCase().includes(query))
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

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  updateStatus(order: Order, newStatus: string): void {
    if (!order._id) return;

    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: (response) => {
        this.showSuccess(`Order status updated to ${newStatus}`);
        this.loadOrders();
        if (this.selectedOrder && this.selectedOrder._id === order._id) {
          this.selectedOrder.status = newStatus as any;
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.showError('Failed to update order status');
      }
    });
  }

  deleteOrder(order: Order): void {
    if (!confirm('Are you sure you want to delete this order?')) return;
    if (!order._id) return;

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

  getStatusColor(status: string): string {
    const colors: any = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

}
