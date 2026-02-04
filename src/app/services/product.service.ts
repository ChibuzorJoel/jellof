import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product-model';




export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  /**
   * Get all products
   * @param filters Optional filters (category, minPrice, maxPrice, search, sort)
   */
  getAllProducts(filters?: any): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.sort) params = params.set('sort', filters.sort);
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  /**
   * Get single product by ID
   */
  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search products
   */
  searchProducts(query: string): Observable<ProductsResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Create new product
   */
  createProduct(product: Product): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, product);
  }

  /**
   * Update existing product
   */
  updateProduct(id: string, product: Partial<Product>): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete product
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get new arrivals (products marked as new)
   */
  getNewArrivals(): Observable<ProductsResponse> {
    return this.getAllProducts({ sort: 'newest' });
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 8): Observable<ProductsResponse> {
    return this.getAllProducts({ sort: 'featured' });
  }
}