import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LookbookProduct {
  name: string;
  price: number;
  link: string;
  productId?: string;
}

export interface LookbookItem {
  _id?: string;
  id?: number;
  title: string;
  season: string;
  image: string;
  products: LookbookProduct[];
  description?: string;
  featured?: boolean;
  active?: boolean;
  displayOrder?: number;
  tags?: string[];
}

export interface LookbookResponse {
  success: boolean;
  count?: number;
  items?: LookbookItem[];
  item?: LookbookItem;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LookbookService {
  private apiUrl = `${environment.apiUrl}/lookbook`;

  constructor(private http: HttpClient) {}

  /**
   * Get all lookbook items
   */
  getAllItems(params?: {
    season?: string;
    featured?: boolean;
  }): Observable<LookbookResponse> {
    let queryParams = '';

    if (params) {
      const paramArray: string[] = [];
      if (params.season) paramArray.push(`season=${params.season}`);
      if (params.featured !== undefined)
        paramArray.push(`featured=${params.featured}`);
      if (paramArray.length > 0) {
        queryParams = '?' + paramArray.join('&');
      }
    }

    return this.http.get<LookbookResponse>(`${this.apiUrl}${queryParams}`);
  }

  /**
   * Get lookbook item by ID
   */
  getItemById(id: string): Observable<LookbookResponse> {
    return this.http.get<LookbookResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create lookbook item (admin only)
   */
  createItem(itemData: Partial<LookbookItem>): Observable<LookbookResponse> {
    return this.http.post<LookbookResponse>(this.apiUrl, itemData);
  }

  /**
   * Update lookbook item (admin only)
   */
  updateItem(
    id: string,
    itemData: Partial<LookbookItem>,
  ): Observable<LookbookResponse> {
    return this.http.put<LookbookResponse>(`${this.apiUrl}/${id}`, itemData);
  }

  /**
   * Delete lookbook item (admin only)
   */
  deleteItem(id: string): Observable<LookbookResponse> {
    return this.http.delete<LookbookResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggle featured status (admin only)
   */
  toggleFeatured(id: string): Observable<LookbookResponse> {
    return this.http.patch<LookbookResponse>(
      `${this.apiUrl}/${id}/featured`,
      {},
    );
  }
}
