import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  productCount?: number;
  displayOrder?: number;
  parentCategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

export interface CategoryResponse {
  success: boolean;
  category: Category;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  /**
   * Get all categories with optional filters
   */
  getAllCategories(filters?: {
    active?: boolean;
    sort?: string;
  }): Observable<CategoriesResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.active !== undefined) {
        params = params.set('active', filters.active.toString());
      }
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
    }

    return this.http.get<CategoriesResponse>(this.apiUrl, { params }).pipe(
      tap(response => console.log('Categories loaded:', response.count)),
      catchError(this.handleError)
    );
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/slug/${slug}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create new category (Admin only)
   */
  createCategory(category: Category): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, category).pipe(
      tap(response => console.log('Category created:', response.category?.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Update category (Admin only)
   */
  updateCategory(id: string, category: Partial<Category>): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, category).pipe(
      tap(response => console.log('Category updated:', response.category?.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete category (Admin only)
   */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Category deleted')),
      catchError(this.handleError)
    );
  }

  /**
   * Update product count for category
   */
  updateProductCount(id: string): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}/update-count`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update all categories product counts
   */
  updateAllProductCounts(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-all-counts`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}