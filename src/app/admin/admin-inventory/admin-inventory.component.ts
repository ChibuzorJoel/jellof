import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface InventoryItem {
  _id?: string;
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  image: string;
  stockStatus: 'in-stock' | 'low' | 'out';
  lastUpdated: Date | string;
}

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit {
  // Navigation
  adminName = 'Admin';
  notificationCount = 5;
  searchQuery = '';

  // Inventory
  inventory: InventoryItem[] = [];
  filteredInventory: InventoryItem[] = [];
  paginatedInventory: InventoryItem[] = [];

  // Filters
  filterStatus: string = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Messages
  successMessage = '';
  errorMessage = '';
  isLoading = true;

  // API URL
  private apiUrl = 'http://localhost:3000/api/inventory';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addDemoInventory();
    this.loadInventory();
  }

  // Add demo inventory
  addDemoInventory(): void {
    this.inventory = [
      {
        _id: 'INV001',
        productId: 'PROD001',
        productName: 'Floral Summer Dress',
        category: 'Dresses',
        currentStock: 15,
        minStock: 10,
        image: 'https://via.placeholder.com/60/2d5016/ffffff?text=Dress',
        stockStatus: 'in-stock',
        lastUpdated: new Date('2024-03-10')
      },
      {
        _id: 'INV002',
        productId: 'PROD002',
        productName: 'Classic Denim Jeans',
        category: 'Bottoms',
        currentStock: 8,
        minStock: 10,
        image: 'https://via.placeholder.com/60/1976D2/ffffff?text=Jeans',
        stockStatus: 'low',
        lastUpdated: new Date('2024-03-09')
      },
      {
        _id: 'INV003',
        productId: 'PROD003',
        productName: 'Cotton T-Shirt',
        category: 'Tops',
        currentStock: 25,
        minStock: 15,
        image: 'https://via.placeholder.com/60/FF9800/ffffff?text=Shirt',
        stockStatus: 'in-stock',
        lastUpdated: new Date('2024-03-08')
      },
      {
        _id: 'INV004',
        productId: 'PROD004',
        productName: 'Leather Jacket',
        category: 'Outerwear',
        currentStock: 3,
        minStock: 5,
        image: 'https://via.placeholder.com/60/795548/ffffff?text=Jacket',
        stockStatus: 'low',
        lastUpdated: new Date('2024-03-07')
      },
      {
        _id: 'INV005',
        productId: 'PROD005',
        productName: 'Winter Coat',
        category: 'Outerwear',
        currentStock: 0,
        minStock: 5,
        image: 'https://via.placeholder.com/60/607D8B/ffffff?text=Coat',
        stockStatus: 'out',
        lastUpdated: new Date('2024-03-05')
      },
      {
        _id: 'INV006',
        productId: 'PROD006',
        productName: 'Summer Sandals',
        category: 'Shoes',
        currentStock: 20,
        minStock: 10,
        image: 'https://via.placeholder.com/60/FFC107/ffffff?text=Sandals',
        stockStatus: 'in-stock',
        lastUpdated: new Date('2024-03-10')
      }
    ];

    this.applyFilters();
    this.isLoading = false;
  }

  // Load inventory from API
  loadInventory(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const apiInventory = response.inventory || [];
        if (apiInventory.length > 0) {
          this.inventory = apiInventory;
        }
        this.applyFilters();
        console.log('Inventory loaded:', this.inventory.length);
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.showError('Using demo inventory (API unavailable)');
        this.applyFilters();
      }
    });
  }

  // Apply filters
  applyFilters(): void {
    let filtered = [...this.inventory];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(i => i.stockStatus === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.productName.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query) ||
        i.productId.toLowerCase().includes(query)
      );
    }

    this.filteredInventory = filtered;
    this.totalPages = Math.ceil(this.filteredInventory.length / this.itemsPerPage);
    this.updatePaginatedInventory();
  }

  // Update paginated inventory
  updatePaginatedInventory(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInventory = this.filteredInventory.slice(startIndex, endIndex);
  }

  // Increase stock
  increaseStock(item: InventoryItem, amount: number = 1): void {
    if (!item._id) return;

    const newStock = item.currentStock + amount;

    this.http.put<any>(`${this.apiUrl}/${item._id}`, {
      currentStock: newStock
    }).subscribe({
      next: (response) => {
        item.currentStock = newStock;
        this.updateStockStatus(item);
        this.applyFilters();
        this.showSuccess(`Stock increased by ${amount}`);
      },
      error: (error) => {
        console.error('Error updating stock:', error);
        item.currentStock = newStock;
        this.updateStockStatus(item);
        this.applyFilters();
        this.showSuccess(`Stock increased by ${amount} (Demo mode)`);
      }
    });
  }

  // Reduce stock
  reduceStock(item: InventoryItem, amount: number = 1): void {
    if (!item._id) return;

    if (item.currentStock < amount) {
      this.showError('Cannot reduce stock below 0');
      return;
    }

    const newStock = item.currentStock - amount;

    this.http.put<any>(`${this.apiUrl}/${item._id}`, {
      currentStock: newStock
    }).subscribe({
      next: (response) => {
        item.currentStock = newStock;
        this.updateStockStatus(item);
        this.applyFilters();
        this.showSuccess(`Stock reduced by ${amount}`);
      },
      error: (error) => {
        console.error('Error updating stock:', error);
        item.currentStock = newStock;
        this.updateStockStatus(item);
        this.applyFilters();
        this.showSuccess(`Stock reduced by ${amount} (Demo mode)`);
      }
    });
  }

  // Update stock status
  updateStockStatus(item: InventoryItem): void {
    if (item.currentStock === 0) {
      item.stockStatus = 'out';
    } else if (item.currentStock < item.minStock) {
      item.stockStatus = 'low';
    } else {
      item.stockStatus = 'in-stock';
    }
    item.lastUpdated = new Date();
  }

  // Get status count
  getStatusCount(status: string): number {
    if (status === 'all') return this.inventory.length;
    return this.inventory.filter(i => i.stockStatus === status).length;
  }

  // Get low stock items
  getLowStockItems(): InventoryItem[] {
    return this.inventory.filter(i => i.stockStatus === 'low' || i.stockStatus === 'out');
  }

  // Get status class
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'in-stock': 'stock-in-stock',
      'low': 'stock-low',
      'out': 'stock-out'
    };
    return classes[status] || '';
  }

  // Get status label
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'in-stock': 'In Stock',
      'low': 'Low Stock',
      'out': 'Out of Stock'
    };
    return labels[status] || status;
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
      this.updatePaginatedInventory();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedInventory();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedInventory();
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
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      this.router.navigate(['/admin/login']);
    }
  }
}