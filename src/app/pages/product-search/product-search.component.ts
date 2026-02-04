import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {

  searchQuery: string = '';

  private readonly MIN_SEARCH_LENGTH = 3;

  constructor(private router: Router) {}

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
}
