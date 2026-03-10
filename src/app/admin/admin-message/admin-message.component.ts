import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Date | string;
}

@Component({
  selector: 'app-admin-message',
  templateUrl: './admin-message.component.html',
  styleUrls: ['./admin-message.component.css']
})
export class AdminMessageComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
  notificationCount = 5;
  searchQuery = '';

  // Messages
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  // Filter
  filterStatus: string = 'all';

  // Modal
  showMessageDetails = false;
  selectedContact: Contact | null = null;
  replyMessage = '';

  // Messages
  successMessage = '';
  errorMessage = '';

  // Loading
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/contacts';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Add demo messages first
    this.addDemoMessages();
    // Then load real messages
    this.loadMessages();
  }

  addDemoMessages(): void {
    this.contacts = [
      {
        _id: 'MSG001',
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 234-5678',
        subject: 'Question about product availability',
        message: 'Hi, I\'m interested in the Floral Summer Dress. Is it available in size M and pink color? Also, when can I expect delivery to New York?',
        status: 'new',
        createdAt: new Date('2024-03-05T10:30:00')
      },
      {
        _id: 'MSG002',
        name: 'James Brown',
        email: 'james.brown@example.com',
        phone: '+1 (555) 876-5432',
        subject: 'Order issue',
        message: 'I received my order but the size is wrong. I ordered XL but received M. Order #DER001. Please help me exchange it.',
        status: 'read',
        createdAt: new Date('2024-03-04T15:20:00')
      },
      {
        _id: 'MSG003',
        name: 'Sophia Martinez',
        email: 'sophia.m@example.com',
        phone: '+1 (555) 345-6789',
        subject: 'Bulk order inquiry',
        message: 'Hello, I represent a boutique store and I\'m interested in placing a bulk order for 50 pieces. Can you provide wholesale pricing?',
        status: 'replied',
        createdAt: new Date('2024-03-03T09:15:00')
      },
      {
        _id: 'MSG004',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 567-8901',
        subject: 'Payment question',
        message: 'Do you accept international credit cards? I\'m ordering from Canada and want to make sure my payment will go through.',
        status: 'new',
        createdAt: new Date('2024-03-02T14:45:00')
      },
      {
        _id: 'MSG005',
        name: 'Olivia Taylor',
        email: 'olivia.taylor@example.com',
        phone: '+1 (555) 789-0123',
        subject: 'Compliment',
        message: 'I just received my order and I absolutely love it! The quality is amazing and the fit is perfect. Will definitely order again!',
        status: 'read',
        createdAt: new Date('2024-03-01T11:30:00')
      }
    ];

    this.filteredContacts = [...this.contacts];
    this.isLoading = false;
  }

  // Load messages from API
  loadMessages(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiContacts = response.contacts || [];
        if (apiContacts.length > 0) {
          this.contacts = apiContacts;
        }
        this.applyFilters();
        console.log('Messages loaded:', this.contacts.length);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.showError('Using demo messages (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters
  applyFilters(): void {
    let filtered = [...this.contacts];

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
        c.subject.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query)
      );
    }

    this.filteredContacts = filtered;
  }

  // Filter by status
  filterByStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  // Get status count
  getStatusCount(status: string): number {
    if (status === 'all') return this.contacts.length;
    return this.contacts.filter(c => c.status === status).length;
  }

  // View message details
  viewMessage(contact: Contact): void {
    this.selectedContact = contact;
    this.showMessageDetails = true;
    this.replyMessage = '';

    // Mark as read
    if (contact.status === 'new') {
      this.updateStatus(contact, 'read');
    }
  }

  // Close details modal
  closeMessageDetails(): void {
    this.showMessageDetails = false;
    this.selectedContact = null;
    this.replyMessage = '';
  }

  // Update message status
  updateStatus(contact: Contact, newStatus: 'new' | 'read' | 'replied'): void {
    if (!contact._id) return;

    this.http.put<any>(`${this.apiUrl}/${contact._id}`, {
      status: newStatus
    }).subscribe({
      next: (response) => {
        contact.status = newStatus;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  // Mark as read
  markAsRead(contact: Contact, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.updateStatus(contact, 'read');
    this.showSuccess('Message marked as read');
  }

  // Mark as unread
  markAsUnread(contact: Contact, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.updateStatus(contact, 'new');
    this.showSuccess('Message marked as unread');
  }

  // Send reply
  sendReply(): void {
    if (!this.selectedContact || !this.replyMessage.trim()) {
      this.showError('Please enter a reply message');
      return;
    }

    // In a real app, this would send an email
    console.log('Sending reply to:', this.selectedContact.email);
    console.log('Reply message:', this.replyMessage);

    this.updateStatus(this.selectedContact, 'replied');
    this.showSuccess('Reply sent successfully!');
    this.closeMessageDetails();
  }

  // Delete message
  deleteMessage(contact: Contact, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    if (!contact._id) return;

    this.http.delete<any>(`${this.apiUrl}/${contact._id}`).subscribe({
      next: (response) => {
        this.showSuccess('Message deleted successfully!');
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error deleting message:', error);
        this.showError('Failed to delete message');
      }
    });
  }

  // Get status color
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'new': '#2196F3',
      'read': '#FF9800',
      'replied': '#4CAF50'
    };
    return colors[status] || '#888';
  }

  // Get status label
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'new': 'New',
      'read': 'Read',
      'replied': 'Replied'
    };
    return labels[status] || status;
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

  // Search
  onSearch(): void {
    this.applyFilters();
  }

  // Navigation
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
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      this.router.navigate(['/admin/login']);
    }
  }

  // Format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}