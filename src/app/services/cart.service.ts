import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  // Get all cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Get cart items as observable
  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  // Add item to cart
  addToCart(product: any, quantity: number = 1, size?: string, color?: string): void {
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

  // Private: Update cart and persist to storage
  private updateCart(): void {
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartToStorage();
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('jellof_cart', JSON.stringify(this.cartItems));
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('jellof_cart');
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