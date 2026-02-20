import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Standard Shipping (5-7 days)', price: 0 },
    { id: 'express', name: 'Express Shipping (2-3 days)', price: 15 },
    { id: 'overnight', name: 'Overnight Shipping (1 day)', price: 30 }
  ];
  selectedShipping: string = 'standard';

  // Coupon
  couponCode: string = '';
  appliedCoupon: any = null;
  discount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.calculateTotals();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  calculateTotals(): void {
    // Subtotal
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

    // Shipping
    const selectedOption = this.shippingOptions.find(opt => opt.id === this.selectedShipping);
    this.shipping = selectedOption ? selectedOption.price : 0;

    // Discount
    this.discount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === 'percentage') {
        this.discount = this.subtotal * (this.appliedCoupon.value / 100);
      } else {
        this.discount = this.appliedCoupon.value;
      }
    }

    // Tax (7.5% VAT)
    this.tax = (this.subtotal - this.discount) * 0.075;

    // Total
    this.total = this.subtotal - this.discount + this.shipping + this.tax;
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateQuantity(index, newQuantity);
      this.loadCart();
      this.calculateTotals();
    }
  }

  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
    this.updateQuantity(index, item.quantity + 1);
  }

  decreaseQuantity(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      this.updateQuantity(index, item.quantity - 1);
    }
  }

  removeItem(index: number): void {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeFromCart(index);
      this.loadCart();
      this.calculateTotals();
    }
  }

  onShippingChange(): void {
    this.calculateTotals();
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    // Mock coupon validation (replace with API call)
    const validCoupons = [
      { code: 'SAVE10', type: 'percentage', value: 10, description: '10% off' },
      { code: 'SAVE20', type: 'percentage', value: 20, description: '20% off' },
      { code: 'FLAT50', type: 'fixed', value: 50, description: '$50 off' }
    ];

    const coupon = validCoupons.find(
      c => c.code.toLowerCase() === this.couponCode.toLowerCase()
    );

    if (coupon) {
      this.appliedCoupon = coupon;
      this.calculateTotals();
      alert(`Coupon "${coupon.code}" applied! ${coupon.description}`);
    } else {
      alert('Invalid coupon code');
    }
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.calculateTotals();
  }

  clearCart(): void {
    if (confirm('Clear all items from cart?')) {
      this.cartService.clearCart();
      this.loadCart();
      this.calculateTotals();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/collections']);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  getItemTotal(item: any): number {
    return item.product.price * item.quantity;
  }
}