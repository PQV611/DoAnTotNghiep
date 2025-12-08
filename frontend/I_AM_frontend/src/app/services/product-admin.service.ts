import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductDTO {
  id: number;
  nameProduct: string;
  description: string;
  categoryId: number;
  categoryName: string;
  totalQuantity: number;
  totalSold: number;
  averageRating: number;
  price: number
  imageUrls: string[];
  colorNames: string[];
  sizeNames: string[];
}

export interface Category {
  id_category: number ;
  nameCategory: string;
}

export interface Color {
  idColor: number ;
  nameColor: string;
  hexCode: string;
}

export interface Size {
  idSize: number;
  nameSize: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private baseUrl = 'http://localhost:8080/admin/products';
  private categoryURL = 'http://localhost:8080/admin/categories';
  private sizeAndColor = 'http://localhost:8080/admin' ;

  constructor(private http: HttpClient) {}

  getVariantsByProductId(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/admin/products/${productId}/variants`);
  }
  
  
  getProducts(search: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('keyword', search)
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(this.baseUrl, { params });
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }
  
  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoryURL}/categories`);
  }

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.sizeAndColor}/colors`);
  }

  getSizes(): Observable<Size[]> {
    return this.http.get<Size[]>(`${this.sizeAndColor}/sizes`);
  }

}
