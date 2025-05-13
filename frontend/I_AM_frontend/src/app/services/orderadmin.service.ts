import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderadminService {
  private baseUrl = 'http://localhost:8080/admin/order';
  
  constructor(private http: HttpClient) { }

  getOrdersByStatus(status: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?status=${status}`);
  }

  updateOrderStatus(orderId: number, newStatus: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/status`, { status: newStatus });
  }

  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }
}
