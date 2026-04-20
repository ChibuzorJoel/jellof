export interface Product {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  discountPrice?: number;
  isNew?: boolean;
  inStock?: boolean;
  colors?: string[];
  sizes?: string[];
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stockQuantity?: number;   // <-- use this for stock count
  sku?: string;
  isOnSale?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional wrapper for service responses
export interface ProductsResponse {
  success: boolean;
  products: Product[];
}