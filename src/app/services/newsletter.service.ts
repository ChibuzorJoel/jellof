import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface NewsletterSubscription {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface SubscribersResponse {
  success: boolean;
  count: number;
  subscribers: Subscriber[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = environment.apiUrl + '/newsletter';

  constructor(private http: HttpClient) { }

  /**
   * Subscribe to newsletter
   */
  subscribe(email: string): Observable<NewsletterResponse> {
    return this.http.post<NewsletterResponse>(`${this.apiUrl}/subscribe`, { email });
  }

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe(email: string): Observable<NewsletterResponse> {
    return this.http.post<NewsletterResponse>(`${this.apiUrl}/unsubscribe`, { email });
  }

  /**
   * Get all subscribers (admin only)
   */
  getAllSubscribers(): Observable<SubscribersResponse> {
    return this.http.get<SubscribersResponse>(`${this.apiUrl}/subscribers`);
  }

  /**
   * Delete subscriber (admin only)
   */
  deleteSubscriber(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/subscribers/${id}`);
  }
}