import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;
  isMenuOpen: boolean = false;
  isCartDropdownOpen: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes to update count
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleCartDropdown(): void {
    this.isCartDropdownOpen = !this.isCartDropdownOpen;
  }

  closeCartDropdown(): void {
    this.isCartDropdownOpen = false;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
    this.closeCartDropdown();
  }

  getCartTotal(): number {
    return this.cartService.getTotalPrice();
  }

  getCartItems(): any[] {
    return this.cartService.getCartItems();
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}