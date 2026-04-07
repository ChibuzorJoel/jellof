import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  orderId?: string;
  userId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status?: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get authorization headers
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Create new order
   */
  createOrder(orderData: Partial<Order>): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.post<OrderResponse>(this.apiUrl, orderData, { headers }).pipe(
      tap(response => console.log('✅ Order created:', response.order?._id)),
      catchError(this.handleError)
    );
  }

  /**
   * Get all orders (for current user or admin)
   */
  getAllOrders(): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.get<OrderResponse>(this.apiUrl, { headers }).pipe(
      tap(response => console.log('Orders loaded:', response.count)),
      catchError(this.handleError)
    );
  }

  /**
   * Get order by ID
   */
  getOrderById(id: string): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: string): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.get<OrderResponse>(`${this.apiUrl}/status/${status}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update order status (admin only)
   */
  updateOrderStatus(id: string, status: string): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.put<OrderResponse>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers }
    ).pipe(
      tap(response => console.log('Order status updated:', status)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete order (admin only)
   */
  deleteOrder(id: string): Observable<OrderResponse> {
    const headers = this.getHeaders();
    
    return this.http.delete<OrderResponse>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log('Order deleted')),
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Order API Error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}