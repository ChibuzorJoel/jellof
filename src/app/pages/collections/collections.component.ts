import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/* =======================
   Interfaces (Models)
======================= */

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
}

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
    {
      id: 1,
      name: 'Silk Summer Dress',
      category: 'Dresses',
      price: 189.99,
      image: 'assets/images/product-1.jpg',
      isNew: true,
      colors: ['Black', 'White', 'Green'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: 'Linen Blazer',
      category: 'Outerwear',
      price: 249.99,
      image: 'assets/images/product-2.jpg',
      isNew: true,
      colors: ['Navy', 'Beige'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 3,
      name: 'Cotton Palazzo Pants',
      category: 'Bottoms',
      price: 129.99,
      image: 'assets/images/product-3.jpg',
      colors: ['White', 'Olive'],
      sizes: ['XS', 'S', 'M', 'L']
    }
  ];

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

  displayedProducts: Product[] = [];
  selectedCategory = 'all';
  sortBy = 'featured';
  priceRange = { min: 0, max: 1000 };
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private route: ActivatedRoute) {}

  /* ---------- Lifecycle ---------- */

  ngOnInit(): void {
    // Read search query from URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.applyFilters();
    });

    this.updateCategoryCounts();
    this.applyFilters();
  }

  /* ---------- Logic ---------- */

  updateCategoryCounts(): void {
    this.categories.forEach(category => {
      category.count =
        category.id === 'all'
          ? this.allProducts.length
          : this.allProducts.filter(p => p.category === category.id).length;
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      p => p.price >= this.priceRange.min && p.price <= this.priceRange.max
    );

    // Search filter (from input OR URL)
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    this.sortProducts(filtered);

    this.displayedProducts = filtered;
  }

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
    }
  }

  onSortChange(value: string): void {
    this.sortBy = value;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
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
}
