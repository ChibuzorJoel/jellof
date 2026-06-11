import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface CartItem {
  product: any;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  /* ================= AUTHENTICATION CHECK ================= */
  
  private checkAuthentication(): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    
    if (!isLoggedIn) {
      // User not logged in - redirect to login
      const currentUrl = this.router.url;
      
      // Show alert
      
      
      // Redirect to login with return URL
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: currentUrl,
          message: 'Please login to add items to your cart'
        }
      });
      
      return false;
    }
    
    return true;
  }

  /* ================= CART OPERATIONS ================= */

  // Get all cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Get cart items as observable
  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  // Add item to cart (REQUIRES LOGIN)
  addToCart(product: any, quantity: number = 1, size?: string, color?: string): boolean {
    // ✅ CHECK AUTHENTICATION FIRST
    if (!this.checkAuthentication()) {
      return false; // User not logged in
    }

    // User is logged in - proceed with adding to cart
    const existingItemIndex = this.cartItems.findIndex(
      item => 
        item.product._id === product._id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      this.cartItems.push({
        product: product,
        quantity: quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.updateCart();
    return true; // Successfully added
  }

  // Remove item from cart
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  // Update item quantity
  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(index);
    } else {
      this.cartItems[index].quantity = quantity;
      this.updateCart();
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  // Check if product is in cart
  isInCart(productId: string): boolean {
    return this.cartItems.some(item => item.product._id === productId);
  }

  // Get quantity of product in cart
  getProductQuantity(productId: string): number {
    const item = this.cartItems.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }

  /* ================= STORAGE ================= */

  // Private: Update cart and persist to storage
  private updateCart(): void {
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartToStorage();
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    // Only save if user is logged in
    if (this.authService.isLoggedIn) {
      const userId = this.authService.currentUserValue?._id;
      const storageKey = userId ? `jellof_cart_${userId}` : 'jellof_cart';
      localStorage.setItem(storageKey, JSON.stringify(this.cartItems));
    }
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    // Only load if user is logged in
    if (this.authService.isLoggedIn) {
      const userId = this.authService.currentUserValue?._id;
      const storageKey = userId ? `jellof_cart_${userId}` : 'jellof_cart';
      const savedCart = localStorage.getItem(storageKey);
      
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          this.cartItemsSubject.next(this.cartItems);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
          this.cartItems = [];
        }
      }
    }
  }

  /* ================= USER-SPECIFIC CART ================= */

  // Load cart for logged-in user
  loadUserCart(): void {
    this.loadCartFromStorage();
  }

  // Clear cart on logout
  clearUserCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    
    // Clear from localStorage
    const userId = this.authService.currentUserValue?._id;
    const storageKey = userId ? `jellof_cart_${userId}` : 'jellof_cart';
    localStorage.removeItem(storageKey);
  }
}