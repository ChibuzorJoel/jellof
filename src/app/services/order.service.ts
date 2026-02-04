import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Order {
  _id?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone: string;
  productName: string;
  productId?: string;
  productPrice: number;
  quantity?: number;
  size?: string;
  color?: string;
  totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'bank_transfer' | 'mobile_money' | 'cash_on_delivery' | 'card' | 'other';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  trackingNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) { }

  /**
   * Create new order (from WhatsApp)
   */
  createOrder(order: Order): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }

  /**
   * Get all orders
   */
  getAllOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  /**
   * Get order by ID
   */
  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: string, status: string): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Delete order
   */
  deleteOrder(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}