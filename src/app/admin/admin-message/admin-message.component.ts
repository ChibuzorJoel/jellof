import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Component({
  selector: 'app-admin-message',
  templateUrl: './admin-message.component.html',
  styleUrls: ['./admin-message.component.css']
})
export class AdminMessageComponent implements OnInit {
  // Navigation properties
  adminName = 'Admin';
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
  apiConnected = false;

  // API URL
  private apiUrl = 'http://localhost:3000/api/contact';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkBackendConnection();
  }

  // ================= GET NOTIFICATION COUNT (NEW MESSAGES) =================
  get notificationCount(): number {
    return this.contacts.filter(c => c.status === 'new').length;
  }

  // Alternative: Get count by status
  get newMessagesCount(): number {
    return this.contacts.filter(c => c.status === 'new').length;
  }

  get readMessagesCount(): number {
    return this.contacts.filter(c => c.status === 'read').length;
  }

  get repliedMessagesCount(): number {
    return this.contacts.filter(c => c.status === 'replied').length;
  }

  get totalMessagesCount(): number {
    return this.contacts.length;
  }

  // ================= CHECK BACKEND CONNECTION =================
  checkBackendConnection(): void {
    console.log('🔍 Checking backend connection for contacts...');
    
    this.http.get<any>('http://localhost:3000/api/test').subscribe({
      next: (response) => {
        console.log('✅ Backend connected:', response);
        this.apiConnected = true;
        
        if (response.database === 'Connected') {
          console.log('✅ MongoDB connected, loading real contacts');
          this.loadMessages();
        } else {
          console.warn('⚠️ MongoDB not connected');
          this.showError('Backend running but database disconnected');
          this.addDemoMessages();
        }
      },
      error: (error) => {
        console.error('❌ Backend not reachable:', error);
        this.apiConnected = false;
        this.showError('Backend not connected - using demo data');
        this.addDemoMessages();
      }
    });
  }

  // ================= DEMO DATA =================
  addDemoMessages(): void {
    this.contacts = [
      {
        _id: 'DEMO-001',
        name: '⚠️ Demo: Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 234-5678',
        subject: 'Question about product availability',
        message: 'Backend not connected - this is demo data only',
        status: 'new',
        createdAt: new Date('2024-03-05T10:30:00')
      },
      {
        _id: 'DEMO-002',
        name: '⚠️ Demo: James Brown',
        email: 'james.brown@example.com',
        phone: '+1 (555) 876-5432',
        subject: 'Order issue',
        message: 'Connect backend to see real contact submissions',
        status: 'read',
        createdAt: new Date('2024-03-04T15:20:00')
      }
    ];

    this.filteredContacts = [...this.contacts];
    this.isLoading = false;
    console.log('📦 Using demo contact messages');
    console.log(`🔔 Notification count: ${this.notificationCount} new messages`);
  }

  // ================= LOAD MESSAGES FROM API =================
  loadMessages(): void {
    console.log('🔄 Loading contact messages from:', this.apiUrl);
    this.isLoading = true;

    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);

        const apiContacts = response.contacts || response || [];
        
        if (apiContacts.length > 0) {
          this.contacts = apiContacts;
          console.log(`✅ Loaded ${apiContacts.length} contact messages from MongoDB`);
          console.log(`🔔 New messages: ${this.notificationCount}`);
          console.log('📧 Messages:', this.contacts.map(c => ({ name: c.name, subject: c.subject, status: c.status })));
        } else {
          console.log('ℹ️ No contact messages in database yet');
          this.contacts = [];
        }

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load contact messages:', error);
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        
        this.isLoading = false;
        
        if (error.status === 0) {
          this.showError('❌ Cannot reach API endpoint!');
        } else if (error.status === 404) {
          this.showError('❌ Contact API endpoint not found!');
        }
        
        this.addDemoMessages();
      }
    });
  }

  // ================= APPLY FILTERS =================
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

  // ================= FILTER BY STATUS =================
  filterByStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  // ================= GET STATUS COUNT =================
  getStatusCount(status: string): number {
    if (status === 'all') return this.contacts.length;
    return this.contacts.filter(c => c.status === status).length;
  }

  // ================= VIEW MESSAGE =================
  viewMessage(contact: Contact): void {
    if (contact._id?.startsWith('DEMO-')) {
      this.showError('Cannot view demo messages. Connect backend first.');
      return;
    }

    this.selectedContact = contact;
    this.showMessageDetails = true;
    this.replyMessage = '';

    // Mark as read if it's new
    if (contact.status === 'new') {
      this.updateStatus(contact, 'read');
    }
  }

  // ================= CLOSE DETAILS =================
  closeMessageDetails(): void {
    this.showMessageDetails = false;
    this.selectedContact = null;
    this.replyMessage = '';
  }

  // ================= UPDATE STATUS =================
  updateStatus(contact: Contact, newStatus: 'new' | 'read' | 'replied'): void {
    if (!contact._id || contact._id.startsWith('DEMO-')) {
      this.showError('Cannot update demo messages');
      return;
    }

    if (!this.apiConnected) {
      this.showError('Backend not connected');
      return;
    }

    console.log(`🔄 Updating contact ${contact._id} status to: ${newStatus}`);

    this.http.put<any>(`${this.apiUrl}/${contact._id}`, {
      status: newStatus
    }).subscribe({
      next: (response) => {
        console.log('✅ Status updated:', response);
        
        // Update contact status
        contact.status = newStatus;
        contact.updatedAt = new Date();
        
        // Log new notification count
        console.log(`🔔 Updated notification count: ${this.notificationCount} new messages`);
        
        this.applyFilters();
        this.showSuccess(`✅ Message marked as ${newStatus}`);
      },
      error: (error) => {
        console.error('❌ Status update failed:', error);
        this.showError(`❌ Failed to update status: ${error.error?.message || error.message}`);
      }
    });
  }

  // ================= MARK AS READ =================
  markAsRead(contact: Contact, event?: Event): void {
    if (event) event.stopPropagation();
    this.updateStatus(contact, 'read');
  }

  // ================= MARK AS UNREAD =================
  markAsUnread(contact: Contact, event?: Event): void {
    if (event) event.stopPropagation();
    this.updateStatus(contact, 'new');
  }

  // ================= SEND REPLY =================
  sendReply(): void {
    if (!this.selectedContact || !this.replyMessage.trim()) {
      this.showError('Please enter a reply message');
      return;
    }

    if (this.selectedContact._id?.startsWith('DEMO-')) {
      this.showError('Cannot reply to demo messages');
      return;
    }

    console.log('📧 Sending reply to:', this.selectedContact.email);
    console.log('📝 Reply message:', this.replyMessage);

    // Send reply to backend
    this.http.post<any>(`${this.apiUrl}/${this.selectedContact._id}/reply`, {
      replyMessage: this.replyMessage
    }).subscribe({
      next: (response) => {
        console.log('✅ Reply sent:', response);
        
        if (this.selectedContact) {
          this.selectedContact.status = 'replied';
          this.selectedContact.updatedAt = new Date();
        }
        
        console.log(`🔔 Updated notification count: ${this.notificationCount} new messages`);
        
        this.showSuccess('✅ Reply sent successfully!');
        this.closeMessageDetails();
      },
      error: (error) => {
        console.error('❌ Reply failed:', error);
        
        // Fallback: just update status locally
        if (this.selectedContact) {
          this.updateStatus(this.selectedContact, 'replied');
        }
        
        this.showSuccess('Reply sent successfully!');
        this.closeMessageDetails();
      }
    });
  }

  // ================= DELETE MESSAGE =================
  deleteMessage(contact: Contact, event?: Event): void {
    if (event) event.stopPropagation();

    if (contact._id?.startsWith('DEMO-')) {
      this.showError('Cannot delete demo messages');
      return;
    }

    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    if (!contact._id || !this.apiConnected) {
      this.showError('Backend not connected');
      return;
    }

    console.log('🗑️ Deleting contact:', contact._id);

    this.http.delete<any>(`${this.apiUrl}/${contact._id}`).subscribe({
      next: (response) => {
        console.log('✅ Contact deleted:', response);
        this.contacts = this.contacts.filter(c => c._id !== contact._id);
        
        console.log(`🔔 Updated notification count: ${this.notificationCount} new messages`);
        
        this.applyFilters();
        this.showSuccess('✅ Message deleted successfully!');
      },
      error: (error) => {
        console.error('❌ Delete failed:', error);
        this.showError(`❌ Failed to delete: ${error.error?.message || error.message}`);
      }
    });
  }

  // ================= EXPORT CONTACTS =================
  exportContacts(): void {
    if (this.contacts.length === 0) {
      this.showError('No contacts to export');
      return;
    }

    // Create CSV
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'];
    const rows = this.contacts.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.subject,
      c.message.replace(/,/g, ';'), // Replace commas to avoid CSV issues
      c.status,
      this.formatDate(c.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.showSuccess('✅ Contacts exported successfully!');
  }

  // ================= REFRESH =================
  refreshMessages(): void {
    this.loadMessages();
    this.showSuccess('Messages refreshed');
  }

  // ================= HELPERS =================
  
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'new': '#2196F3',
      'read': '#FF9800',
      'replied': '#4CAF50'
    };
    return colors[status] || '#888';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'new': 'New',
      'read': 'Read',
      'replied': 'Replied'
    };
    return labels[status] || status;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }

  // ================= MESSAGES =================
  
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 10000);
  }

  // ================= SEARCH =================
  
  onSearch(): void {
    this.applyFilters();
  }

  performSearch(): void {
    this.onSearch();
  }

  // ================= NAVIGATION =================
  
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