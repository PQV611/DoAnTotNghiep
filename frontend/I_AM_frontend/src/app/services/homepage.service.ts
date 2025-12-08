import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  nameProduct: string;
  price: number;
  image1: string; // ảnh hiển thị chính
  image2: string; // ảnh hover
  isActive: number
}

@Injectable({
  providedIn: 'root'
})


export class HomepageService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http:HttpClient) { }

  getTop5Products(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top5`);
  }
}
