import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryDTO {
  id_category?: number;
  name_category: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-based)
}


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:8080/admin/categories';
  constructor(private http:HttpClient) { }

  getPage(page: number, size: number): Observable<PageResponse<CategoryDTO>> {
    return this.http.get<PageResponse<CategoryDTO>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
  
  // getCategoriesFiltered(keyword: string, page: number, size: number): Observable<PageResponse<CategoryDTO>> {
  //   return this.http.get<PageResponse<CategoryDTO>>(
  //     `${this.apiUrl}/search?keyword=${keyword}&page=${page}&size=${size}`
  //   );
  // }  

  getCategoriesFiltered(keyword: string, page: number, size: number): Observable<PageResponse<CategoryDTO>> {
    return this.http.get<PageResponse<CategoryDTO>>(
      `${this.apiUrl}?keyword=${keyword}&page=${page}&size=${size}`
    );
  }
  

  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.apiUrl);
  }

  create(category: CategoryDTO): Observable<any> {
    return this.http.post(this.apiUrl, category, { responseType: 'text' });
  }

  update(id: number, category: CategoryDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category, { responseType: 'text' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
