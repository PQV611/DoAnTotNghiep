import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number,
  cardId: number, 
  productName: string,
  imageUrl: string,
  color: string,
  size: string,
  quantity: number,
  price: number,
  totalItemCost: number
}

// export interface CartDetail {
//   orderCode: number;
//   productCode: number;
//   image: string;
//   productName: string;
//   color: string;
//   size: string;
//   discountAmount: number;
//   numberDiscount: number;
//   quantity: number;
//   total: number;
// }

export interface CartItemDetail {
  productCode: number;
  productName: string;
  image: string;
  color: string;
  size: string;
  originalPrice: number;
  activeDiscount: boolean;
  salePrice: number;
  discountAmount: number;
  numberDiscount: number;
  quantity: number;
  total: number;
}

export interface CartDetailResponse {
  items: CartItemDetail[];
  totalCost: number;
  totalItems: number;
  TongTienHang: number;
}



@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/cart';
  constructor(private http: HttpClient) { }

  addToCart(productId: number, color: string, size: string, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { productId, color, size, quantity };
    return this.http.post(`${this.baseUrl}/add`, body, { headers });
  }

  getCartDetails(): Observable<CartDetailResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<CartDetailResponse>(`${this.baseUrl}/details`, { headers });
  }

  // cart.service.ts
  updateQuantity(productId: number, color: string, size: string, quantityChange: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { productId, color, size, quantityChange };
    return this.http.post(`${this.baseUrl}/update-quantity`, body, { headers });
  }

  removeItem(productId: number, color: string, size: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete(`${this.baseUrl}/remove`, {
      headers,
      params: {
        productId: productId.toString(),
        color,
        size
      }
    });
  }

  // Thanh toán
  checkout(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.baseUrl}/checkout`, data, { headers });
  }

}
