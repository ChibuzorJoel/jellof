import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // User
  currentUser: User | null = null;

  // Cart
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  // Form - will be auto-filled from user data
  customerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  };

  paymentMethod: string = 'whatsapp';
  
  // States
  isProcessing: boolean = false;
  orderPlaced: boolean = false;
  orderId: string = '';
  errors: any = {};

  // Shipping options
  shippingOptions = [
    { id: 'standard', name: 'Standard Shipping (5-7 days)', price: 0 },
    { id: 'express', name: 'Express Shipping (2-3 days)', price: 15 },
    { id: 'overnight', name: 'Overnight Shipping (1 day)', price: 30 }
  ];
  selectedShipping: string = 'standard';

  // Saved addresses
  savedAddresses: any[] = [];
  selectedAddressId: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.currentUserValue;
    
    // If not logged in, redirect to login (AuthGuard should handle this, but double-check)
    if (!this.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Auto-fill form with user data
    this.customerInfo = {
      firstName: this.currentUser.firstName || '',
      lastName: this.currentUser.lastName || '',
      email: this.currentUser.email || '',
      phone: this.currentUser.phone || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria'
    };

    // Load saved addresses
    if (this.currentUser.addresses && this.currentUser.addresses.length > 0) {
      this.savedAddresses = this.currentUser.addresses;
      
      // Auto-select default address
      const defaultAddress = this.savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        this.selectSavedAddress(defaultAddress._id || '');
      }
    }

    this.loadCart();
    this.calculateTotals();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/collections']);
    }
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

    const selectedOption = this.shippingOptions.find(opt => opt.id === this.selectedShipping);
    this.shipping = selectedOption ? selectedOption.price : 0;

    this.tax = this.subtotal * 0.075;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  onShippingChange(): void {
    this.calculateTotals();
  }

  // Select a saved address
  selectSavedAddress(addressId: string): void {
    this.selectedAddressId = addressId;
    const address = this.savedAddresses.find(addr => addr._id === addressId);
    
    if (address) {
      this.customerInfo.address = address.address;
      this.customerInfo.city = address.city;
      this.customerInfo.state = address.state;
      this.customerInfo.zipCode = address.zipCode;
      this.customerInfo.country = address.country;
    }
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.customerInfo.firstName.trim()) {
      this.errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!this.customerInfo.lastName.trim()) {
      this.errors.lastName = 'Last name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.customerInfo.email.trim()) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.customerInfo.email)) {
      this.errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!this.customerInfo.phone.trim()) {
      this.errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!this.customerInfo.address.trim()) {
      this.errors.address = 'Address is required';
      isValid = false;
    }

    if (!this.customerInfo.city.trim()) {
      this.errors.city = 'City is required';
      isValid = false;
    }

    return isValid;
  }

  placeOrder(): void {
    if (!this.validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (this.paymentMethod === 'whatsapp') {
      this.placeOrderViaWhatsApp();
    } else {
      this.placeOrderViaAPI();
    }
  }

  placeOrderViaWhatsApp(): void {
    let message = `🛍️ *NEW ORDER REQUEST*\n\n`;
    message += `*Customer Information:*\n`;
    message += `Name: ${this.customerInfo.firstName} ${this.customerInfo.lastName}\n`;
    message += `Email: ${this.customerInfo.email}\n`;
    message += `Phone: ${this.customerInfo.phone}\n`;
    message += `Address: ${this.customerInfo.address}, ${this.customerInfo.city}\n`;
    message += `${this.customerInfo.state ? this.customerInfo.state + ', ' : ''}${this.customerInfo.country}\n\n`;

    message += `*Order Items:*\n`;
    this.cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Qty: ${item.quantity} × $${item.product.price.toFixed(2)} = $${(item.quantity * item.product.price).toFixed(2)}\n`;
      if (item.selectedSize) message += `   Size: ${item.selectedSize}\n`;
      if (item.selectedColor) message += `   Color: ${item.selectedColor}\n`;
    });

    message += `\n*Order Summary:*\n`;
    message += `Subtotal: $${this.subtotal.toFixed(2)}\n`;
    message += `Shipping: $${this.shipping.toFixed(2)}\n`;
    message += `Tax: $${this.tax.toFixed(2)}\n`;
    message += `*Total: $${this.total.toFixed(2)}*\n\n`;
    message += `Payment Method: WhatsApp Order`;

    const whatsappNumber = '2348012345678';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      this.orderPlaced = true;
      this.orderId = 'WA-' + Date.now();
      this.cartService.clearCart();
    }, 1000);
  }

  placeOrderViaAPI(): void {
    this.isProcessing = true;

    // ✅ FIXED: Use 'any' type to avoid TypeScript strict type checking
    const orderData: any = {
      userId: this.currentUser?._id,
      customer: this.customerInfo,
      items: this.cartItems.map(item => ({
        productId: item.product._id || item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total,
      paymentMethod: this.paymentMethod,
      shippingMethod: this.selectedShipping
      // Note: Backend will set: status, paymentStatus, orderId, createdAt, updatedAt
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.orderPlaced = true;
        
        // ✅ FIXED: Safe access with proper null checking and fallback
        if (response && response.order) {
          this.orderId = response.order._id || response.order.orderId || 'ORDER-' + Date.now();
        } else {
          this.orderId = 'ORDER-' + Date.now();
        }
        
        this.cartService.clearCart();

        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      },
      error: (error) => {
        console.error('Order error:', error);
        alert('Failed to place order. Please try again or contact support.');
        this.isProcessing = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/collections']);
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
    this.loadCart();
    this.calculateTotals();
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateQuantity(index, newQuantity);
      this.loadCart();
      this.calculateTotals();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}