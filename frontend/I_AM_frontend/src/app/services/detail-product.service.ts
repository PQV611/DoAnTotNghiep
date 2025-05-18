import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductDetail {
  id: number;
  nameProduct: string;
  code: string;
  rating: number;
  originalPrice: number;
  salePrice: number;
  numberDiscount: number;
  colors: string[]; // ví dụ: ['#ffffff', '#000000']
  sizes: string[];  // ví dụ: ['S', 'M', 'L']
  mainImage: string;
  imageList: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DetailProductService {
  private baseUrl = 'http://localhost:8080/detail'
  constructor(private http: HttpClient) { }

  getProductDetail(productId: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/product/${productId}`);
  }

  getSizesByColor(productId: number, color: string): Observable<string[]> {
  const url = `http://localhost:8080/detail/product/sizes-by-color?productId=${productId}&color=${encodeURIComponent(color)}`;
  return this.http.get<string[]>(url);
}

}
