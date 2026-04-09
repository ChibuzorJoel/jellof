import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface NewsletterSubscriber {
  _id?: string;
  email: string;
  name?: string;
  status?: 'active' | 'unsubscribed' | 'bounced';
  source?: string;
  preferences?: {
    newArrivals?: boolean;
    sales?: boolean;
    styling?: boolean;
    weeklyDigest?: boolean;
  };
  subscribedAt?: Date;
  unsubscribedAt?: Date;
}

export interface NewsletterResponse {
  success: boolean;
  message?: string;
  subscriber?: NewsletterSubscriber;
  subscribers?: NewsletterSubscriber[];
  count?: number;
  stats?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/newsletter`;

  constructor(private http: HttpClient) {}

  /**
   * Subscribe to newsletter
   */
  subscribe(data: {
    email: string;
    name?: string;
    source?: string;
    preferences?: any;
  }): Observable<NewsletterResponse> {
    return this.http.post<NewsletterResponse>(`${this.apiUrl}/subscribe`, data);
  }

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe(email: string): Observable<NewsletterResponse> {
    return this.http.get<NewsletterResponse>(`${this.apiUrl}/unsubscribe/${email}`);
  }

  /**
   * Get all subscribers (admin)
   */
  getAllSubscribers(params?: {
    status?: string;
    source?: string;
    limit?: number;
  }): Observable<NewsletterResponse> {
    let queryParams = '';
    
    if (params) {
      const paramArray: string[] = [];
      if (params.status) paramArray.push(`status=${params.status}`);
      if (params.source) paramArray.push(`source=${params.source}`);
      if (params.limit) paramArray.push(`limit=${params.limit}`);
      if (paramArray.length > 0) {
        queryParams = '?' + paramArray.join('&');
      }
    }

    return this.http.get<NewsletterResponse>(`${this.apiUrl}${queryParams}`);
  }

  /**
   * Get subscriber by email (admin)
   */
  getSubscriberByEmail(email: string): Observable<NewsletterResponse> {
    return this.http.get<NewsletterResponse>(`${this.apiUrl}/${email}`);
  }

  /**
   * Update preferences
   */
  updatePreferences(email: string, preferences: any): Observable<NewsletterResponse> {
    return this.http.put<NewsletterResponse>(
      `${this.apiUrl}/${email}/preferences`,
      { preferences }
    );
  }

  /**
   * Delete subscriber (admin)
   */
  deleteSubscriber(id: string): Observable<NewsletterResponse> {
    return this.http.delete<NewsletterResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get statistics (admin)
   */
  getStatistics(): Observable<NewsletterResponse> {
    return this.http.get<NewsletterResponse>(`${this.apiUrl}/stats`);
  }

  /**
   * Export subscribers (admin)
   */
  exportSubscribers(status?: string): string {
    const url = status 
      ? `${this.apiUrl}/export?status=${status}`
      : `${this.apiUrl}/export`;
    return url;
  }
}