import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderHistory {
  orderId: number;
  orderCode: string;
  createdAt: string; // HH:mm:ss dd/MM/yyyy
  status: number;
  paymentMethod: string;
  totalCost: number;
  items: OrderItem[];
}

export interface OrderItem {
  productName: string;
  quantity: number;
}

export interface OrderProduct {
  productId: number;
  productName: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  total: number;
}

export interface OrderDetailResponse {
  orderId: number;
  orderCode: string;
  createdAt: string;
  status: number;
  paymentMethod: string;
  customerName: string;
  fullname: string;
  address: string;
  phone: string;
  totalCost: number;
  products: OrderProduct[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdercustomerService {
  private baseUrl = 'http://localhost:8080/admin/order';
  constructor(private http:HttpClient) { }

  getOrderHistory(): Observable<OrderHistory[]> {
    const token = localStorage.getItem('token');
    return this.http.get<OrderHistory[]>(`${this.baseUrl}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getOrderDetail(orderId: number): Observable<OrderDetailResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<OrderDetailResponse>(`${this.baseUrl}/detail/${orderId}`, { headers });
  }

  confirmReceived(orderId: number) {
    const token = localStorage.getItem('token');
    return this.http.put(`http://localhost:8080/admin/order/confirm-received/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  cancelOrder(orderId: number) {
    const token = localStorage.getItem('token');
    return this.http.put(`http://localhost:8080/admin/order/cancel/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

}
