import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService, User } from '../../services/auth.service';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // ================= USER =================
  currentUser: User | null = null;

  // ================= CART =================
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  // ================= CUSTOMER FORM =================
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

  // ================= STATES =================
  isProcessing: boolean = false;
  orderPlaced: boolean = false;
  orderId: string = '';
  errors: any = {};

  // ================= SHIPPING =================
  shippingOptions: ShippingOption[] = [
    { id: 'standard', name: 'Standard Shipping (5-7 days)', price: 0 },
    { id: 'express', name: 'Express Shipping (2-3 days)', price: 15 },
    { id: 'overnight', name: 'Overnight Shipping (1 day)', price: 30 }
  ];

  selectedShipping: string = 'standard';

  // ================= SAVED ADDRESSES =================
  savedAddresses: any[] = [];
  selectedAddressId: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.prefillUserData();
    this.loadSavedAddresses();
    this.loadCart();
    this.calculateTotals();
  }

  // ================= PREFILL USER =================
  prefillUserData(): void {

    if (!this.currentUser) return;

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
  }

  // ================= LOAD ADDRESSES =================
  loadSavedAddresses(): void {

    if (!this.currentUser?.addresses) return;

    this.savedAddresses = this.currentUser.addresses;

    const defaultAddress = this.savedAddresses.find(a => a.isDefault);

    if (defaultAddress) {
      this.selectSavedAddress(defaultAddress._id || '');
    }
  }

  // ================= LOAD CART =================
  loadCart(): void {

    this.cartItems = this.cartService.getCartItems();

    if (this.cartItems.length === 0) {
      this.router.navigate(['/collections']);
    }
  }

  // ================= TOTAL CALCULATIONS =================
  calculateTotals(): void {

    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const selectedOption = this.shippingOptions.find(
      opt => opt.id === this.selectedShipping
    );

    this.shipping = selectedOption ? selectedOption.price : 0;

    this.tax = this.subtotal * 0.075;

    this.total = this.subtotal + this.shipping + this.tax;
  }

  onShippingChange(): void {
    this.calculateTotals();
  }

  // ================= ADDRESS SELECT =================
  selectSavedAddress(addressId: string): void {

    this.selectedAddressId = addressId;

    const address = this.savedAddresses.find(a => a._id === addressId);

    if (!address) return;

    this.customerInfo.address = address.address || '';
    this.customerInfo.city = address.city || '';
    this.customerInfo.state = address.state || '';
    this.customerInfo.zipCode = address.zipCode || '';
    this.customerInfo.country = address.country || 'Nigeria';
  }

  // ================= FORM VALIDATION =================
  validateForm(): boolean {

    this.errors = {};
    let valid = true;

    if (!this.customerInfo.firstName.trim()) {
      this.errors.firstName = 'First name is required';
      valid = false;
    }

    if (!this.customerInfo.lastName.trim()) {
      this.errors.lastName = 'Last name is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.customerInfo.email.trim()) {
      this.errors.email = 'Email is required';
      valid = false;
    }
    else if (!emailRegex.test(this.customerInfo.email)) {
      this.errors.email = 'Invalid email format';
      valid = false;
    }

    if (!this.customerInfo.phone.trim()) {
      this.errors.phone = 'Phone number is required';
      valid = false;
    }

    if (!this.customerInfo.address.trim()) {
      this.errors.address = 'Address is required';
      valid = false;
    }

    if (!this.customerInfo.city.trim()) {
      this.errors.city = 'City is required';
      valid = false;
    }

    return valid;
  }

  // ================= PLACE ORDER =================
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

  // ================= WHATSAPP ORDER =================
  placeOrderViaWhatsApp(): void {

    let message = `🛍️ *NEW ORDER*\n\n`;

    message += `*Customer*\n`;
    message += `${this.customerInfo.firstName} ${this.customerInfo.lastName}\n`;
    message += `${this.customerInfo.phone}\n`;
    message += `${this.customerInfo.email}\n\n`;

    message += `*Address*\n`;
    message += `${this.customerInfo.address}, ${this.customerInfo.city}\n`;
    message += `${this.customerInfo.state}, ${this.customerInfo.country}\n\n`;

    message += `*Items*\n`;

    this.cartItems.forEach((item, i) => {

      message += `${i + 1}. ${item.product.name}\n`;
      message += `Qty: ${item.quantity}\n`;
      message += `Price: $${item.product.price}\n`;

      if (item.selectedSize) {
        message += `Size: ${item.selectedSize}\n`;
      }

      if (item.selectedColor) {
        message += `Color: ${item.selectedColor}\n`;
      }

      message += '\n';
    });

    message += `Subtotal: $${this.subtotal}\n`;
    message += `Shipping: $${this.shipping}\n`;
    message += `Tax: $${this.tax}\n`;
    message += `Total: $${this.total}\n`;

    const number = '2348012345678';

    const url =
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

    this.orderPlaced = true;
    this.orderId = 'WA-' + Date.now();

    this.cartService.clearCart();
  }

  // ================= API ORDER =================
  placeOrderViaAPI(): void {

    this.isProcessing = true;

    const orderData: any = {

      userId: this.currentUser?._id,

      customer: this.customerInfo,

      items: this.cartItems.map(item => ({
        productId: item.product._id || item.product.id,
        name: item.product.name,
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
    };

    this.orderService.createOrder(orderData).subscribe({

      next: (res: any) => {

        this.isProcessing = false;

        this.orderPlaced = true;

        this.orderId =
          res?.order?._id ||
          res?.order?.orderId ||
          'ORDER-' + Date.now();

        this.cartService.clearCart();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      error: (err) => {

        console.error('Order error:', err);

        alert('Order failed. Please try again.');

        this.isProcessing = false;
      }
    });
  }

  // ================= CART ACTIONS =================
  removeItem(index: number): void {

    this.cartService.removeFromCart(index);

    this.loadCart();

    this.calculateTotals();
  }

  updateQuantity(index: number, qty: number): void {

    if (qty <= 0) return;

    this.cartService.updateQuantity(index, qty);

    this.loadCart();

    this.calculateTotals();
  }

  // ================= NAVIGATION =================
  continueShopping(): void {
    this.router.navigate(['/collections']);
  }

  logout(): void {
    this.authService.logout();
  }
}