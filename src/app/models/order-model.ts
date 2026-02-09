export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Customer {
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
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: string;
  shippingMethod?: string;
  createdAt?: string;
  orderId?: string; // optional to match your CheckoutComponent
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  message?: string;
  orders: Order[];
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}
