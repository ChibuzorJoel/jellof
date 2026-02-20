import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {

  searchQuery: string = '';
  currentUser: User | null = null;
  isDropdownOpen = false;

  private readonly MIN_SEARCH_LENGTH = 3;

  constructor(private router: Router, private authService: AuthService,) {}
  
  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  /**
   * Triggered on keyup from your existing HTML
   * Navigates user to collections page ONLY if 3+ letters
   */
  onSearch(): void {
    const query = this.searchQuery.trim();

    // ❌ block navigation for empty, 1 or 2 characters
    if (!query || query.length < this.MIN_SEARCH_LENGTH) {
      return;
    }

    // ✅ navigate only when 3+ characters
    this.router.navigate(['/collections'], {
      queryParams: {
        search: query
      }
    });
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.account-dropdown-container');
    
    if (dropdown && !dropdown.contains(target)) {
      this.closeDropdown();
    }
  }

  navigateToLogin(): void {
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.closeDropdown();
    this.router.navigate(['/register']);
  }

  navigateToAccount(): void {
    this.closeDropdown();
    this.router.navigate(['/account']);
  }

  navigateToOrders(): void {
    this.closeDropdown();
    this.router.navigate(['/orders']);
  }

  navigateToWishlist(): void {
    this.closeDropdown();
    this.router.navigate(['/wishlist']);
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserFirstName(): string {
    if (this.currentUser && this.currentUser.firstName) {
      return this.currentUser.firstName;
    }
    return '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
