import { Component } from '@angular/core';

/* =======================
   Interfaces (Models)
======================= */

export interface LookbookProduct {
  name: string;
  price: number;
  link: string;
}

export interface LookbookItem {
  id: number;
  title: string;
  season: string;
  image: string;
  products: LookbookProduct[];
  description?: string;
}

/* =======================
   Component
======================= */

@Component({
  selector: 'app-lookbook',
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.css']
})
export class LookbookComponent {

  currentSeason = 'Spring/Summer 2026';

  lookbookItems: LookbookItem[] = [
    {
      id: 1,
      title: 'Coastal Elegance',
      season: 'Spring/Summer 2026',
      image: 'assets/images/lookbook-1.jpg',
      description: 'Breathable fabrics meet timeless silhouettes for effortless summer style',
      products: [
        { name: 'Linen Dress', price: 189.99, link: '/collections' },
        { name: 'Straw Hat', price: 59.99, link: '/collections' },
        { name: 'Leather Sandals', price: 129.99, link: '/collections' }
      ]
    },
    {
      id: 2,
      title: 'Urban Sophistication',
      season: 'Spring/Summer 2026',
      image: 'assets/images/lookbook-2.jpg',
      description: 'Tailored pieces designed for the modern professional',
      products: [
        { name: 'Tailored Blazer', price: 249.99, link: '/collections' },
        { name: 'Silk Blouse', price: 159.99, link: '/collections' },
        { name: 'Wide-Leg Trousers', price: 179.99, link: '/collections' }
      ]
    }
  ];

  selectedItem: LookbookItem | null = null;

  styleTips = [
    {
      icon: '👗',
      title: 'Invest in Timeless Pieces',
      description: 'Choose classic silhouettes that transcend seasonal trends'
    },
    {
      icon: '🎨',
      title: 'Mix Textures',
      description: 'Combine different fabrics to add depth and interest to your outfit'
    },
    {
      icon: '✨',
      title: 'Accessorize Mindfully',
      description: 'Let one statement piece shine while keeping others subtle'
    },
    {
      icon: '🌿',
      title: 'Embrace Sustainable Fashion',
      description: 'Build a capsule wardrobe with quality pieces that last'
    }
  ];

  viewLookbookDetail(item: LookbookItem): void {
    this.selectedItem = item;
  }

  closeModal(): void {
    this.selectedItem = null;
  }

  getTotalLookPrice(item: LookbookItem): number {
    return item.products.reduce((total, product) => total + product.price, 0);
  }
}