import { Component, OnInit } from '@angular/core';
import { LookbookService, LookbookItem } from '../../services/lookbook.service';

@Component({
  selector: 'app-lookbook',
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.css']
})
export class LookbookComponent implements OnInit {

  currentSeason = 'Spring/Summer 2026';
  lookbookItems: LookbookItem[] = [];
  selectedItem: LookbookItem | null = null;
  isLoading = false;
  errorMessage = '';

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

  constructor(private lookbookService: LookbookService) {}

  ngOnInit(): void {
    this.loadLookbookItems();
  }

  loadLookbookItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.lookbookService.getAllItems().subscribe({
      next: (response) => {
        if (response.success && response.items) {
          this.lookbookItems = response.items;
          console.log('✅ Lookbook items loaded:', this.lookbookItems.length);
        } else {
          // Use fallback data if no items in backend
          this.loadFallbackData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading lookbook:', error);
        this.errorMessage = 'Failed to load lookbook items';
        
        // Use fallback data on error
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }

  private loadFallbackData(): void {
    // Fallback data if backend is empty or fails
    this.lookbookItems = [
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
      },
      {
        id: 3,
        title: 'Evening Glamour',
        season: 'Spring/Summer 2026',
        image: 'assets/images/lookbook-3.jpg',
        description: 'Elegant pieces for special occasions and night outs',
        products: [
          { name: 'Silk Evening Dress', price: 299.99, link: '/collections' },
          { name: 'Statement Necklace', price: 89.99, link: '/collections' },
          { name: 'Heeled Sandals', price: 169.99, link: '/collections' }
        ]
      }
    ];
    console.log('📦 Using fallback lookbook data');
  }

  viewLookbookDetail(item: LookbookItem): void {
    this.selectedItem = item;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal(): void {
    this.selectedItem = null;
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }

  getTotalLookPrice(item: LookbookItem): number {
    return item.products.reduce((total, product) => total + product.price, 0);
  }

  retryLoad(): void {
    this.loadLookbookItems();
  }
}