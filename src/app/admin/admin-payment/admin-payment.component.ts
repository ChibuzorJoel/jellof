
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Payment {
  _id?: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: 'card' | 'bank' | 'paypal' | 'cash';
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: Date | string;
}

@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrls: ['./admin-payment.component.css']
})
export class AdminPaymentComponent implements OnInit {
  // Navigation
  adminName = 'Admin';
  
  searchQuery = '';

  // Payments
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  paginatedPayments: Payment[] = [];

  // Filters
  filterStatus: string = 'all';
  filterMethod: string = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  private contactMessages: any[] = [];
  // Messages
  successMessage = '';
  errorMessage = '';
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/payments';
  private contactApiUrl = 'http://localhost:3000/api/contact';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.addDemoPayments();
    this.loadPayments();
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
  // Add demo payments
  addDemoPayments(): void {
    this.payments = [
      {
        _id: 'PAY001',
        orderId: 'ORD001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        amount: 159.98,
        paymentMethod: 'card',
        transactionId: 'TXN-2024-001-4532',
        status: 'pending',
        date: new Date('2024-03-10T10:30:00')
      },
      {
        _id: 'PAY002',
        orderId: 'ORD002',
        customerName: 'Michael Chen',
        customerEmail: 'michael.c@example.com',
        amount: 89.99,
        paymentMethod: 'paypal',
        transactionId: 'TXN-2024-002-7821',
        status: 'completed',
        date: new Date('2024-03-09T14:20:00')
      },
      {
        _id: 'PAY003',
        orderId: 'ORD003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@example.com',
        amount: 234.50,
        paymentMethod: 'card',
        transactionId: 'TXN-2024-003-1094',
        status: 'approved',
        date: new Date('2024-03-08T09:15:00')
      },
      {
        _id: 'PAY004',
        orderId: 'ORD004',
        customerName: 'James Brown',
        customerEmail: 'james.b@example.com',
        amount: 67.50,
        paymentMethod: 'bank',
        transactionId: 'TXN-2024-004-3421',
        status: 'rejected',
        date: new Date('2024-03-07T16:45:00')
      },
      {
        _id: 'PAY005',
        orderId: 'ORD005',
        customerName: 'Olivia Martinez',
        customerEmail: 'olivia.m@example.com',
        amount: 125.00,
        paymentMethod: 'card',
        transactionId: 'TXN-2024-005-8765',
        status: 'completed',
        date: new Date('2024-03-06T11:30:00')
      }
    ];

    this.applyFilters();
    this.isLoading = false;
  }

  // Load payments from API
  loadPayments(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiPayments = response.payments || [];
        if (apiPayments.length > 0) {
          this.payments = apiPayments;
        }
        this.applyFilters();
        console.log('Payments loaded:', this.payments.length);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.showError('Using demo payments (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters
  applyFilters(): void {
    let filtered = [...this.payments];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    // Payment method filter
    if (this.filterMethod !== 'all') {
      filtered = filtered.filter(p => p.paymentMethod === this.filterMethod);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.orderId.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.customerEmail.toLowerCase().includes(query) ||
        p.transactionId.toLowerCase().includes(query)
      );
    }

    this.filteredPayments = filtered;
    this.totalPages = Math.ceil(this.filteredPayments.length / this.itemsPerPage);
    this.updatePaginatedPayments();
  }

  // Update paginated payments
  updatePaginatedPayments(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPayments = this.filteredPayments.slice(startIndex, endIndex);
  }

  // Update payment status
  updatePaymentStatus(payment: Payment, newStatus: 'pending' | 'approved' | 'rejected' | 'completed'): void {
    if (!payment._id) return;

    const confirmMessage = this.getConfirmMessage(newStatus);
    if (!confirm(confirmMessage)) {
      return;
    }

    this.http.put<any>(`${this.apiUrl}/${payment._id}`, {
      status: newStatus
    }).subscribe({
      next: (response) => {
        payment.status = newStatus;
        this.applyFilters();
        this.showSuccess(`Payment ${newStatus} successfully!`);
      },
      error: (error) => {
        console.error('Error updating payment:', error);
        // For demo: update locally
        payment.status = newStatus;
        this.applyFilters();
        this.showSuccess(`Payment ${newStatus} successfully! (Demo mode)`);
      }
    });
  }

  // Get confirmation message
  getConfirmMessage(status: string): string {
    const messages: { [key: string]: string } = {
      'approved': 'Are you sure you want to approve this payment?',
      'rejected': 'Are you sure you want to reject this payment?',
      'completed': 'Are you sure you want to mark this payment as completed?',
      'pending': 'Are you sure you want to mark this payment as pending?'
    };
    return messages[status] || 'Are you sure?';
  }

  // Approve payment
  approvePayment(payment: Payment, event?: Event): void {
    if (event) event.stopPropagation();
    this.updatePaymentStatus(payment, 'approved');
  }

  // Reject payment
  rejectPayment(payment: Payment, event?: Event): void {
    if (event) event.stopPropagation();
    this.updatePaymentStatus(payment, 'rejected');
  }

  // Mark as completed
  completePayment(payment: Payment, event?: Event): void {
    if (event) event.stopPropagation();
    this.updatePaymentStatus(payment, 'completed');
  }

  // Get status count
  getStatusCount(status: string): number {
    if (status === 'all') return this.payments.length;
    return this.payments.filter(p => p.status === status).length;
  }

  // Get status class
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'completed': 'status-completed'
    };
    return classes[status] || '';
  }

  // Get status label
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed'
    };
    return labels[status] || status;
  }

  // Get payment method icon
  getPaymentMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      'card': '💳',
      'paypal': '🅿️',
      'bank': '🏦',
      'cash': '💵'
    };
    return icons[method] || '💰';
  }

  // Get payment method label
  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'card': 'Credit Card',
      'paypal': 'PayPal',
      'bank': 'Bank Transfer',
      'cash': 'Cash'
    };
    return labels[method] || method;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  // Pagination
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPayments();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPayments();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPayments();
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
    this.filterMethod = 'all';
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