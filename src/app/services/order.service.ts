import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order, OrderResponse, OrdersResponse } from '../models/order-model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /* ================= CREATE ================= */
  createOrder(order: Order): Observable<OrderResponse> {
    // Ensure all required fields exist
    const orderPayload: Order = {
      ...order,
      shippingFee: order.shippingFee ?? 0,
      totalAmount: order.totalAmount ?? this.calculateTotalAmount(order),
      paymentStatus: order.paymentStatus ?? 'pending',
      status: order.status ?? 'pending' // ensure 'status' exists for AdminOrderComponent
    };

    return this.http.post<OrderResponse>(this.apiUrl, orderPayload);
  }

  /* ================= READ ================= */
  getAllOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }

  getOrdersByEmail(email: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/customer/${email}`);
  }

  getOrdersByStatus(status: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/status/${status}`);
  }

  /* ================= UPDATE ================= */
  updateOrderStatus(orderId: string, status: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(
      `${this.apiUrl}/${orderId}/status`,
      { status }
    );
  }

  /* ================= DELETE ================= */
  deleteOrder(orderId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${orderId}`);
  }

  /* ================= HELPERS ================= */
  private calculateTotalAmount(order: Order): number {
    const itemsTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = order.shippingFee ?? 0;
    return itemsTotal + shippingFee;
  }
}
