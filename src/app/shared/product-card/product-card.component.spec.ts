import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input() product: any;
  @Output() quickView = new EventEmitter<any>();

  selectedSize: string = '';
  selectedColor: string = '';
  showSizeSelector: boolean = false;

  quantity: number = 1;
  addedToCart: boolean = false;

  constructor(private cartService: CartService) {}

  /* ================= COLOR HANDLING ================= */

  getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      white: '#FFFFFF',
      gray: '#808080',
      grey: '#808080',
      red: '#DC143C',
      blue: '#0066CC',
      green: '#2d5016',
      yellow: '#FFD700',
      orange: '#FF8C00',
      pink: '#FF69B4',
      purple: '#9370DB',
      brown: '#8B4513',

      navy: '#000080',
      beige: '#F5F5DC',
      ivory: '#FFFFF0',
      cream: '#FFFDD0',
      olive: '#808000',
      maroon: '#800000',
      gold: '#FFD700',
      silver: '#C0C0C0',

      multi: 'linear-gradient(135deg, #667eea, #764ba2)',
      'black/white': 'linear-gradient(90deg, #000 50%, #fff 50%)'
    };

    const key = colorName.toLowerCase().trim();
    return colorMap[key] || colorName;
  }

  /* ================= SIZE & COLOR ================= */

  selectSize(size: string): void {
    this.selectedSize = size;
    this.showSizeSelector = false;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  /* ================= QUANTITY ================= */

  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /* ================= CART ================= */

  addToCart(): void {
    if (this.product.sizes?.length && !this.selectedSize) {
      this.showSizeSelector = true;
      return;
    }

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    this.addedToCart = true;

    setTimeout(() => {
      this.addedToCart = false;
      this.quantity = 1;
    }, 2000);
  }

  /* ================= QUICK VIEW ================= */

  openQuickView(): void {
    this.quickView.emit(this.product);
  }

  /* ================= WHATSAPP ================= */

  orderViaWhatsApp(): void {
    const message =
      `Hi! I'm interested in this product:\n\n` +
      `📦 ${this.product.name}\n` +
      `💰 Price: $${this.product.price}\n` +
      `📊 Quantity: ${this.quantity}\n` +
      `${this.selectedSize ? `📏 Size: ${this.selectedSize}\n` : ''}` +
      `${this.selectedColor ? `🎨 Color: ${this.selectedColor}\n` : ''}` +
      `💵 Total: $${(this.product.price * this.quantity).toFixed(2)}\n\n` +
      `🖼️ Image: ${this.product.image}`;

    const whatsappNumber = '2348012345678'; // change to yours
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { CartService } from '../../services/cart.service';
    
    @Component({
      selector: 'app-product-card',
      templateUrl: './product-card.component.html',
      styleUrls: ['./product-card.component.css']
    })
    export class ProductCardComponent {
    
      @Input() product!: any;
      @Output() quickView = new EventEmitter<any>();
    
      selectedSize: string = '';
      selectedColor: string = '';
      showSizeSelector: boolean = false;
    
      quantity: number = 1;
      addedToCart: boolean = false;
    
      constructor(private cartService: CartService) {}
    
      /* ========= COLORS ========= */
      getColorCode(colorName: string): string {
        const colors: Record<string, string> = {
          black: '#000000',
          white: '#ffffff',
          red: '#dc143c',
          blue: '#0066cc',
          green: '#2d5016',
          yellow: '#ffd700',
          pink: '#ff69b4',
          purple: '#9370db',
          brown: '#8b4513',
          gold: '#ffd700',
          silver: '#c0c0c0',
          multi: 'linear-gradient(135deg,#667eea,#764ba2)'
        };
    
        return colors[colorName?.toLowerCase()] || colorName;
      }
    
      /* ========= SIZE & COLOR ========= */
      selectSize(size: string): void {
        this.selectedSize = size;
        this.showSizeSelector = false;
      }
    
      selectColor(color: string): void {
        this.selectedColor = color;
      }
    
      /* ========= QUANTITY ========= */
      increaseQuantity(): void {
        if (this.quantity < 99) this.quantity++;
      }
    
      decreaseQuantity(): void {
        if (this.quantity > 1) this.quantity--;
      }
    
      /* ========= CART ========= */
      addToCart(): void {
        if (this.product?.sizes?.length && !this.selectedSize) {
          this.showSizeSelector = true;
          return;
        }
    
        this.cartService.addToCart(
          this.product,
          this.quantity,
          this.selectedSize,
          this.selectedColor
        );
    
        this.addedToCart = true;
    
        setTimeout(() => {
          this.addedToCart = false;
          this.quantity = 1;
        }, 2000);
      }
    
      /* ========= QUICK VIEW ========= */
      openQuickView(): void {
        this.quickView.emit(this.product);
      }
    
      /* ========= WHATSAPP ========= */
      orderViaWhatsApp(): void {
        const message =
          `Product: ${this.product.name}\n` +
          `Price: $${this.product.price}\n` +
          `Quantity: ${this.quantity}\n` +
          `${this.selectedSize ? `Size: ${this.selectedSize}\n` : ''}` +
          `${this.selectedColor ? `Color: ${this.selectedColor}\n` : ''}`;
    
        const phone = '2348012345678';
        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
          '_blank'
        );
      }
    }
    
  }
}
