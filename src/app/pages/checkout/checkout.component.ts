import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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

  // ================= PAYMENT =================
  paymentMethod: string = 'card';
  
  // Card Payment
  cardInfo = {
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  };

  // Bank Transfer
  bankTransfer = {
    accountName: '',
    accountNumber: '',
    bankName: '',
    referenceNumber: ''
  };

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
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Allow guest checkout
    if (!this.currentUser) {
      console.log('Guest checkout enabled');
    } else {
      this.prefillUserData();
      this.loadSavedAddresses();
    }

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
    this.tax = this.subtotal * 0.075; // 7.5% tax
    this.total = this.subtotal + this.shipping + this.tax;
  }

  onShippingChange(): void {
    this.calculateTotals();
  }

  // ================= PAYMENT METHOD =================
  onPaymentMethodChange(): void {
    this.errors = {};
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

    // Customer info validation
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

    // Payment validation
    if (this.paymentMethod === 'card') {
      if (!this.validateCardInfo()) {
        valid = false;
      }
    } else if (this.paymentMethod === 'transfer') {
      if (!this.validateBankTransfer()) {
        valid = false;
      }
    }

    return valid;
  }

  // ================= CARD VALIDATION =================
  validateCardInfo(): boolean {
    let valid = true;

    if (!this.cardInfo.cardNumber.trim()) {
      this.errors.cardNumber = 'Card number is required';
      valid = false;
    } else if (!/^\d{16}$/.test(this.cardInfo.cardNumber.replace(/\s/g, ''))) {
      this.errors.cardNumber = 'Invalid card number (16 digits required)';
      valid = false;
    }

    if (!this.cardInfo.cardName.trim()) {
      this.errors.cardName = 'Cardholder name is required';
      valid = false;
    }

    if (!this.cardInfo.expiryMonth || !this.cardInfo.expiryYear) {
      this.errors.expiry = 'Expiry date is required';
      valid = false;
    }

    if (!this.cardInfo.cvv.trim()) {
      this.errors.cvv = 'CVV is required';
      valid = false;
    } else if (!/^\d{3,4}$/.test(this.cardInfo.cvv)) {
      this.errors.cvv = 'Invalid CVV (3-4 digits)';
      valid = false;
    }

    return valid;
  }

  // ================= BANK TRANSFER VALIDATION =================
  validateBankTransfer(): boolean {
    let valid = true;

    if (!this.bankTransfer.accountName.trim()) {
      this.errors.accountName = 'Account name is required';
      valid = false;
    }

    if (!this.bankTransfer.accountNumber.trim()) {
      this.errors.accountNumber = 'Account number is required';
      valid = false;
    }

    if (!this.bankTransfer.bankName.trim()) {
      this.errors.bankName = 'Bank name is required';
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

      this.notificationService.error('Please fill in all required fields correctly');
      return;
    }

    if (this.paymentMethod === 'whatsapp') {
      this.placeOrderViaWhatsApp();
    } else {
      this.placeOrderViaBackend();
    }
  }

  // ================= WHATSAPP ORDER =================
  placeOrderViaWhatsApp(): void {
    // First save to database
    this.saveOrderToDatabase('whatsapp');

    // Then open WhatsApp
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
      message += `   Qty: ${item.quantity} × $${item.product.price.toFixed(2)}\n`;

      if (item.selectedSize) {
        message += `   Size: ${item.selectedSize}\n`;
      }

      if (item.selectedColor) {
        message += `   Color: ${item.selectedColor}\n`;
      }

      message += '\n';
    });

    message += `*Order Summary*\n`;
    message += `Subtotal: $${this.subtotal.toFixed(2)}\n`;
    message += `Shipping: $${this.shipping.toFixed(2)}\n`;
    message += `Tax: $${this.tax.toFixed(2)}\n`;
    message += `*Total: $${this.total.toFixed(2)}*\n`;

    const number = '2349062307424';

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

    this.orderPlaced = true;
    this.cartService.clearCart();
    this.notificationService.success('Order placed successfully! Check WhatsApp for confirmation.');
  }

  // ================= BACKEND ORDER =================
  placeOrderViaBackend(): void {
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
        color: item.selectedColor,
        image: item.product.image || item.product.images?.[0]
      })),

      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total,

      paymentMethod: this.paymentMethod,
      shippingMethod: this.selectedShipping,
      status: 'pending',

      // Include payment details (sanitized)
      paymentDetails: this.getPaymentDetails()
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('✅ Order created successfully:', response);

        this.isProcessing = false;
        this.orderPlaced = true;

        this.orderId = response?.order?._id || response?.order?.orderId || 'ORDER-' + Date.now();

        this.cartService.clearCart();

        this.notificationService.success(
          `Order placed successfully! Order ID: ${this.orderId.substring(0, 8)}...`
        );

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      error: (error) => {
        console.error('❌ Order creation failed:', error);

        this.isProcessing = false;

        this.notificationService.error(
          error.message || 'Failed to place order. Please try again or contact support.'
        );
      }
    });
  }

  // ================= GET PAYMENT DETAILS =================
  private getPaymentDetails(): any {
    if (this.paymentMethod === 'card') {
      return {
        type: 'card',
        last4: this.cardInfo.cardNumber.slice(-4),
        cardName: this.cardInfo.cardName,
        // Never store full card number or CVV
      };
    } else if (this.paymentMethod === 'transfer') {
      return {
        type: 'transfer',
        accountName: this.bankTransfer.accountName,
        accountNumber: this.bankTransfer.accountNumber,
        bankName: this.bankTransfer.bankName,
        referenceNumber: this.bankTransfer.referenceNumber
      };
    } else if (this.paymentMethod === 'whatsapp') {
      return {
        type: 'whatsapp',
        phone: this.customerInfo.phone
      };
    }
    return {};
  }

  // ================= SAVE TO DATABASE =================
  private saveOrderToDatabase(method: string): void {
    const orderData: any = {
      userId: this.currentUser?._id,
      customer: this.customerInfo,
      items: this.cartItems.map(item => ({
        productId: item.product._id || item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.image || item.product.images?.[0]
      })),
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total,
      paymentMethod: method,
      shippingMethod: this.selectedShipping,
      status: 'pending'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('✅ Order saved to database:', response.order?._id);
        this.orderId = response?.order?._id || 'ORDER-' + Date.now();
      },
      error: (error) => {
        console.error('⚠️ Failed to save order to database:', error.message);
        this.orderId = 'WA-' + Date.now();
      }
    });
  }

  // ================= CARD FORMATTING =================
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardInfo.cardNumber = formatted;
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

  viewOrder(): void {
    if (this.orderId) {
      this.router.navigate(['/orders', this.orderId]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}