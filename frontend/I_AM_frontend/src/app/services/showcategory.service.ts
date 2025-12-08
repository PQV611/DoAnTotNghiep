import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductCategory {
  id: number;
  nameProduct: string;
  numberDiscount: number; // phần trăm giảm (0 nếu không có)
  originalPrice: number;
  salePrice: number;
  image1: string;
  image2: string;
  isActive: number;
  activeDiscount: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ShowcategoryService {
  private baseUrl = 'http://localhost:8080/category';
  constructor(private http: HttpClient) { }

  getProductsByCategoryPaged(page: number, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(`${this.baseUrl}/all`, { params });
  }

  getFilteredProducts(
    page: number,
    sizeOption?: string,
    minPrice?: number,
    maxPrice?: number,
    categoryId?: number
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', 20);

    if (sizeOption) params = params.set('sizeOption', sizeOption);
    if (minPrice !== undefined) params = params.set('minPrice', minPrice);
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice);
    if (categoryId) params = params.set('categoryId', categoryId);

    return this.http.get<any>(`${this.baseUrl}/all2`, { params });
  }

  searchProductsPaged(
  page: number,
  keyword: string,
  sizeOption?: string,
  minPrice?: number,
  maxPrice?: number
): Observable<any> {
  let params = new HttpParams()
    .set('page', page)
    .set('size', 20)
    .set('keyword', keyword);

  if (sizeOption) params = params.set('sizeOption', sizeOption);
  if (minPrice !== undefined) params = params.set('minPrice', minPrice);
  if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice);

  return this.http.get(`${this.baseUrl}/search`, { params });
}
}
