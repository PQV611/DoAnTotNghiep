import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FavouriteProduct {
  idProduct: number;
  nameProduct: string;
  originalPrice: number;
  salePrice: number;
  activeDiscount: boolean
  numberDiscount: number;
  image1: string;
  image2: string;
  isActive: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  private baseUrl = 'http://localhost:8080/favourite';

  constructor(private http: HttpClient) {}

  getFavourites(): Observable<FavouriteProduct[]> {
    const token = localStorage.getItem('token');
    return this.http.get<FavouriteProduct[]>(`${this.baseUrl}/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  toggleFavourite(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/toggle/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
