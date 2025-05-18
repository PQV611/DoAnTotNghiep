import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { FavouriteProduct } from './favourite.service';

const BASE_URL = 'http://localhost:8080/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(data: {username: string, password: string}) : Observable<any> {
    console.log("Login data: ", data);
    console.log("Login data: ", data.username, data.password);
    return this.http.post(`${BASE_URL}/login`, data);
  }

  register(data: {username: string; password: string; email: string; fullName: string;}) : Observable<any> {
    console.log("Register data: ", data);
    return this.http.post(`${BASE_URL}/register`, data);
  }

  saveToken(token: string) :void{
    localStorage.setItem('token', token);
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload: ", payload);
    return payload?.authorities?.[0]?.authority || null; // Trả về USER, STAFF, ADMIN
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  isLoggedIn() : boolean {
    return !!this.getToken();
  }

  // Hàm lấy dánh sách sản phẩm yêu thích của khách hàng
  getFavouriteProducts(): Observable<FavouriteProduct[]> {
    const token = localStorage.getItem('token');
    return this.http.get<FavouriteProduct[]>('http://localhost:8080/favourite/active', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout (): void {
    localStorage.removeItem('token');
    // window.location.href = '/login';
  }

  getCartTotalQuantity(): Observable< {totalQuantity: number }> {
    const token = localStorage.getItem('token');
    return this.http.get<{totalQuantity:number}>('http://localhost:8080/cart/total-quantity', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Lấy danh sách sản phẩm trong giỏ hàng CỦA KHÁCH HÀNG ĐĂNG NHẬP
  getCartDetails(): Observable<{ items: CartItem[]; totalCost: number }> {
  const token = localStorage.getItem('token');
  return this.http.get<{ items: CartItem[]; totalCost: number }>('http://localhost:8080/cart', {
    headers: { Authorization: `Bearer ${token}` }
  });

}
}
