import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-notification',
  templateUrl: './cart-notification.component.html',
  styleUrls: ['./cart-notification.component.css']
})
export class CartNotificationComponent implements OnInit {
  @Input() product: any = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() viewCart = new EventEmitter<void>();

  autoCloseTimer: any;

  ngOnInit(): void {
    if (this.isVisible) {
      this.startAutoClose();
    }
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.startAutoClose();
    }
  }

  startAutoClose(): void {
    // Auto close after 5 seconds
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    this.autoCloseTimer = setTimeout(() => {
      this.closeNotification();
    }, 5000);
  }

  closeNotification(): void {
    this.close.emit();
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  goToCart(): void {
    this.viewCart.emit();
    this.closeNotification();
  }

  continueShopping(): void {
    this.closeNotification();
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }
}