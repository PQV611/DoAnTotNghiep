import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface DiscountDTO {
  id_product: number;
  name_product: string;
  numberDiscount: number;
  endDate: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private apiUrl = 'http://localhost:8080/admin/discounts';

  constructor(private http: HttpClient) {}

  getDiscounts(page: number, keyword: string = ''): Observable<PageResponse<DiscountDTO>> {
    return this.http.get<PageResponse<DiscountDTO>>(
      `http://localhost:8080/admin/discounts?page=${page}&size=6&keyword=${keyword}`
    );
  }

  getDiscountsFiltered(keyword: string, status: string, page: number, size:number): Observable<PageResponse<DiscountDTO>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('status', status)
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<DiscountDTO>>('http://localhost:8080/admin/discounts/search', { params });
  }
  

  create(discount: DiscountDTO): Observable<any> {
    return this.http.post(this.apiUrl, discount);
  }

  update(discount: DiscountDTO): Observable<any> {
    return this.http.put(this.apiUrl, discount);
  }

  delete(id_product: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_product}`);
  }
}
