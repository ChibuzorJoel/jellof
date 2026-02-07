import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product-model';

/* =======================
   Interfaces (Models)
======================= */
export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

/* =======================
   Component
======================= */
@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  /* ---------- Products ---------- */
  allProducts: Product[] = [
    // DRESSES (10 products)
    {
      id: '1',
      name: 'Silk Summer Dress',
      category: 'Dresses',
      price: 189.99,
      image: 'assets/images/product-1.jpeg',
      description: 'Luxurious silk dress perfect for summer occasions',
      isNew: true,
      inStock: true,
      colors: ['Black', 'White', 'Green'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '2',
      name: 'Floral Maxi Dress',
      category: 'Dresses',
      price: 149.99,
      image: 'assets/images/product-2.jpeg',
      description: 'Beautiful floral print maxi dress with flowing fabric',
      isNew: true,
      inStock: true,
      colors: ['Blue', 'Pink', 'Yellow'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '3',
      name: 'Midi Wrap Dress',
      category: 'Dresses',
      price: 129.99,
      image: 'assets/images/product-3.jpeg',
      description: 'Elegant wrap dress with adjustable tie',
      isNew: false,
      inStock: true,
      colors: ['Navy', 'Burgundy', 'Forest Green'],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: '4',
      name: 'A-Line Cocktail Dress',
      category: 'Dresses',
      price: 199.99,
      image: 'assets/images/product-4.jpeg',
      description: 'Sophisticated cocktail dress for special occasions',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Red', 'Emerald'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '5',
      name: 'Linen Shirt Dress',
      category: 'Dresses',
      price: 119.99,
      image: 'assets/images/product-5.jpeg',
      description: 'Casual linen shirt dress for everyday wear',
      isNew: false,
      inStock: true,
      colors: ['White', 'Beige', 'Light Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: '6',
      name: 'Pleated Midi Dress',
      category: 'Dresses',
      price: 159.99,
      image: 'assets/images/product-6.jpeg',
      description: 'Elegant pleated dress with modern silhouette',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Navy', 'Burgundy'],
      sizes: ['S', 'M', 'L']
    },
    {
      id: '7',
      name: 'Off-Shoulder Dress',
      category: 'Dresses',
      price: 139.99,
      image: 'assets/images/product-7.jpeg',
      description: 'Romantic off-shoulder dress with ruffle details',
      isNew: false,
      inStock: true,
      colors: ['White', 'Pink', 'Yellow'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '8',
      name: 'Bodycon Mini Dress',
      category: 'Dresses',
      price: 89.99,
      image: 'assets/images/product-8.jpeg',
      description: 'Sleek bodycon dress for night out',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Red', 'White'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '9',
      name: 'Bohemian Maxi Dress',
      category: 'Dresses',
      price: 169.99,
      image: 'assets/images/product-9.jpeg',
      description: 'Free-spirited bohemian style maxi dress',
      isNew: true,
      inStock: true,
      colors: ['Multi', 'Turquoise', 'Coral'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '10',
      name: 'Satin Slip Dress',
      category: 'Dresses',
      price: 109.99,
      image: 'assets/images/product-10.jpeg',
      description: 'Luxe satin slip dress with delicate straps',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Champagne', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L']
    },

    // TOPS (8 products)
    {
      id: '11',
      name: 'Silk Blouse',
      category: 'Tops',
      price: 89.99,
      image: 'assets/images/product-11.jpeg',
      description: 'Classic silk blouse perfect for office or evening',
      isNew: true,
      inStock: true,
      colors: ['White', 'Black', 'Ivory'],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: '12',
      name: 'Cotton T-Shirt',
      category: 'Tops',
      price: 39.99,
      image: 'assets/images/product-12.jpeg',
      description: 'Soft organic cotton basic tee',
      isNew: false,
      inStock: true,
      colors: ['White', 'Black', 'Gray', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: '13',
      name: 'Knit Sweater',
      category: 'Tops',
      price: 79.99,
      image: 'assets/images/product-13.jpeg',
      description: 'Cozy knit sweater for cool days',
      isNew: true,
      inStock: true,
      colors: ['Cream', 'Camel', 'Charcoal'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '14',
      name: 'Peplum Top',
      category: 'Tops',
      price: 69.99,
      image: 'assets/images/product-14.jpeg',
      description: 'Feminine peplum top with fitted waist',
      isNew: false,
      inStock: true,
      colors: ['Black', 'White', 'Pink'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '15',
      name: 'Linen Button-Up',
      category: 'Tops',
      price: 74.99,
      image: 'assets/images/product-15.jpeg',
      description: 'Breathable linen shirt for summer',
      isNew: false,
      inStock: true,
      colors: ['White', 'Beige', 'Sky Blue'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '16',
      name: 'Crop Top',
      category: 'Tops',
      price: 49.99,
      image: 'assets/images/product-16.jpeg',
      description: 'Modern crop top with clean lines',
      isNew: true,
      inStock: true,
      colors: ['Black', 'White', 'Olive'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '17',
      name: 'Turtleneck Sweater',
      category: 'Tops',
      price: 84.99,
      image: 'assets/images/product-17.jpeg',
      description: 'Warm turtleneck sweater in soft cashmere blend',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Navy', 'Camel'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '18',
      name: 'Striped T-Shirt',
      category: 'Tops',
      price: 44.99,
      image: 'assets/images/product-18.jpeg',
      description: 'Classic striped tee in organic cotton',
      isNew: false,
      inStock: true,
      colors: ['Navy/White', 'Black/White', 'Red/White'],
      sizes: ['S', 'M', 'L', 'XL']
    },

    // BOTTOMS (8 products)
    {
      id: '19',
      name: 'Cotton Palazzo Pants',
      category: 'Bottoms',
      price: 129.99,
      image: 'assets/images/product-19.jpeg',
      description: 'Flowing palazzo pants in soft cotton',
      isNew: true,
      inStock: true,
      colors: ['White', 'Olive', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '20',
      name: 'High-Waist Jeans',
      category: 'Bottoms',
      price: 99.99,
      image: 'assets/images/product-20.jpeg',
      description: 'Classic high-waist denim jeans',
      isNew: false,
      inStock: true,
      colors: ['Blue', 'Black', 'White'],
      sizes: ['24', '26', '28', '30', '32']
    },
    {
      id: '21',
      name: 'Wide Leg Trousers',
      category: 'Bottoms',
      price: 119.99,
      image: 'assets/images/product-21.jpeg',
      description: 'Elegant wide-leg trousers for office',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Gray', 'Camel'],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: '22',
      name: 'Midi Skirt',
      category: 'Bottoms',
      price: 89.99,
      image: 'assets/images/product-22.jpeg',
      description: 'Versatile midi skirt with elastic waist',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Navy', 'Burgundy'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '23',
      name: 'Pleated Skirt',
      category: 'Bottoms',
      price: 94.99,
      image: 'assets/images/product-23.jpeg',
      description: 'Feminine pleated skirt in flowing fabric',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Blush', 'Emerald'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '24',
      name: 'Tailored Shorts',
      category: 'Bottoms',
      price: 74.99,
      image: 'assets/images/product-24.jpeg',
      description: 'Smart tailored shorts for summer',
      isNew: true,
      inStock: true,
      colors: ['Black', 'White', 'Khaki'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: '25',
      name: 'Culottes',
      category: 'Bottoms',
      price: 109.99,
      image: 'assets/images/product-25.jpeg',
      description: 'Modern culottes with wide legs',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Navy', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '26',
      name: 'Leather Pants',
      category: 'Bottoms',
      price: 199.99,
      image: 'assets/images/product-26.jpeg',
      description: 'Sleek vegan leather pants',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Brown'],
      sizes: ['XS', 'S', 'M', 'L']
    },

    // OUTERWEAR (6 products)
    {
      id: '27',
      name: 'Linen Blazer',
      category: 'Outerwear',
      price: 249.99,
      image: 'assets/images/product-27.jpeg',
      description: 'Lightweight linen blazer for layering',
      isNew: true,
      inStock: true,
      colors: ['Navy', 'Beige', 'White'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '28',
      name: 'Trench Coat',
      category: 'Outerwear',
      price: 299.99,
      image: 'assets/images/product-28.jpg',
      description: 'Classic trench coat in water-resistant fabric',
      isNew: false,
      inStock: true,
      colors: ['Beige', 'Black', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '29',
      name: 'Wool Coat',
      category: 'Outerwear',
      price: 349.99,
      image: 'assets/images/product-29.jpeg',
      description: 'Luxurious wool coat for winter',
      isNew: true,
      inStock: true,
      colors: ['Camel', 'Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '30',
      name: 'Denim Jacket',
      category: 'Outerwear',
      price: 129.99,
      image: 'assets/images/product-30.jpeg',
      description: 'Classic denim jacket for casual wear',
      isNew: false,
      inStock: true,
      colors: ['Blue', 'Black', 'White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
      id: '31',
      name: 'Bomber Jacket',
      category: 'Outerwear',
      price: 189.99,
      image: 'assets/images/product-31.jpeg',
      description: 'Stylish bomber jacket with modern fit',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Olive', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: '32',
      name: 'Leather Jacket',
      category: 'Outerwear',
      price: 399.99,
      image: 'assets/images/product-32.jpeg',
      description: 'Premium vegan leather jacket',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Brown'],
      sizes: ['XS', 'S', 'M', 'L']
    },

    // ACCESSORIES (8 products)
    {
      id: '33',
      name: 'Statement Necklace',
      category: 'Accessories',
      price: 79.99,
      image: 'assets/images/product-33.jpeg',
      description: 'Bold statement necklace to elevate any outfit',
      isNew: true,
      inStock: true,
      colors: ['Gold', 'Silver', 'Rose Gold']
    },
    {
      id: '34',
      name: 'Leather Tote Bag',
      category: 'Accessories',
      price: 299.99,
      image: 'assets/images/product-34.jpeg',
      description: 'Spacious leather tote for everyday use',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Brown', 'Tan']
    },
    {
      id: '35',
      name: 'Silk Scarf',
      category: 'Accessories',
      price: 59.99,
      image: 'assets/images/product-35.jpeg',
      description: 'Luxurious silk scarf with elegant print',
      isNew: false,
      inStock: true,
      colors: ['Multi', 'Navy', 'Red']
    },
    {
      id: '36',
      name: 'Wide Brim Hat',
      category: 'Accessories',
      price: 69.99,
      image: 'assets/images/product-36.jpeg',
      description: 'Stylish wide brim hat for sun protection',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Beige', 'White']
    },
    {
      id: '37',
      name: 'Leather Belt',
      category: 'Accessories',
      price: 49.99,
      image: 'assets/images/product-37.jpeg',
      description: 'Classic leather belt with gold buckle',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Brown', 'Tan']
    },
    {
      id: '38',
      name: 'Crossbody Bag',
      category: 'Accessories',
      price: 149.99,
      image: 'assets/images/product-38.jpeg',
      description: 'Compact crossbody bag for essentials',
      isNew: true,
      inStock: true,
      colors: ['Black', 'Camel', 'Navy']
    },
    {
      id: '39',
      name: 'Sunglasses',
      category: 'Accessories',
      price: 89.99,
      image: 'assets/images/product-39.jpeg',
      description: 'Designer-inspired sunglasses with UV protection',
      isNew: false,
      inStock: true,
      colors: ['Black', 'Tortoise', 'Gold']
    },
    {
      id: '40',
      name: 'Hair Clips Set',
      category: 'Accessories',
      price: 29.99,
      image: 'assets/images/product-40.jpeg',
      description: 'Set of elegant hair clips',
      isNew: true,
      inStock: true,
      colors: ['Gold', 'Silver', 'Pearl']
    }
  ];

  displayedProducts: Product[] = [];
  quickViewProduct: Product | null = null;

  /* ---------- Categories ---------- */
  categories: Category[] = [
    { id: 'all', name: 'All Products', image: '', count: 0 },
    { id: 'Dresses', name: 'Dresses', image: 'assets/images/category-dresses.jpg', count: 0 },
    { id: 'Tops', name: 'Tops', image: 'assets/images/category-tops.jpg', count: 0 },
    { id: 'Bottoms', name: 'Bottoms', image: 'assets/images/category-bottoms.jpg', count: 0 },
    { id: 'Outerwear', name: 'Outerwear', image: 'assets/images/category-outerwear.jpg', count: 0 },
    { id: 'Accessories', name: 'Accessories', image: 'assets/images/category-accessories.jpg', count: 0 }
  ];

  /* ---------- UI State ---------- */
  selectedCategory = 'all';
  sortBy = 'featured';
  priceRange = { min: 0, max: 1000 };
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;
  errorMessage = '';
  showQuickView = false;

  /* ---------- Constructor ---------- */
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  /* ---------- Lifecycle ---------- */
  ngOnInit(): void {
    // Read query params (search & category)
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery = params['search'];
      if (params['category']) this.selectedCategory = params['category'];
    });

    this.loadProducts();
  }

  /* ---------- API ---------- */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAllProducts().subscribe({
      next: (res) => {
        // If API returns products, use them; otherwise use local products
        if (res.products && res.products.length > 0) {
          this.allProducts = res.products.map(p => ({
            ...p,
            id: p.id?.toString() || p._id?.toString() || undefined
          }));
        }
        // else: keep the hardcoded products above
        
        this.updateCategoryCounts();
        this.applyFilters(true);
        this.isLoading = false;
      },
      error: () => {
        // On error, use hardcoded products
        this.updateCategoryCounts();
        this.applyFilters(true);
        this.isLoading = false;
      }
    });
  }

  retryLoad(): void {
    this.loadProducts();
  }

  /* ---------- Filters ---------- */
  updateCategoryCounts(): void {
    this.categories.forEach(cat => {
      cat.count =
        cat.id === 'all'
          ? this.allProducts.length
          : this.allProducts.filter(p => p.category === cat.id).length;
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters(scrollToProduct: boolean = false): void {
    let filtered = [...this.allProducts];

    // Category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Price
    filtered = filtered.filter(p => p.price >= this.priceRange.min && p.price <= this.priceRange.max);

    // Search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    this.sortProducts(filtered);

    this.displayedProducts = filtered;

    if (scrollToProduct) this.scrollToFirstProduct();
  }

  /* ---------- Sorting ---------- */
  sortProducts(products: Product[]): void {
    switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break; // featured
    }
  }

  onSortChange(value: string): void {
    this.sortBy = value;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters(true);
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.sortBy = 'featured';
    this.priceRange = { min: 0, max: 1000 };
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  /* ---------- Scroll ---------- */
  private scrollToFirstProduct(): void {
    if (!this.displayedProducts.length) return;

    const product = this.displayedProducts[0];
    const id = product._id || product.id;

    setTimeout(() => {
      const el = document.getElementById(`product-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  /* ---------- Quick View ---------- */
  openQuickView(product: Product): void {
    this.quickViewProduct = product;
    this.showQuickView = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.quickViewProduct = null;
    document.body.style.overflow = 'auto';
  }
}